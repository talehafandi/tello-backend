import Model from '../models/category.model.js';
import asyncMiddleware from '../middlewares/async.middleware.js'

const list = asyncMiddleware(async (req, res) => {
    const categories = await Model.find({ parent: null })
            .populate({ path: 'subCategories', select: "_id name slug" });
        res.status(200).json(categories);
})

const getCategory = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
        const category = await Model.findById(id)
            .populate({ path: 'subCategories', select: "_id name slug" });
        if (!category) return res.status(404).send({ message: 'ITEM_NOT_FOUND' });
        res.status(200).json(category);
})

const create = asyncMiddleware(async (req, res) => {
    const category = await Model.create(req.body);
        if (category.parent) await Model.findByIdAndUpdate(category.parent, { $addToSet: { subCategories: category._id } });
        res.status(201).json(category);
})

const update = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    if (payload.subCategories) delete payload.subCategories;

    const category = await Model.findById(id)
    if (!category) return res.status(404).send({ message: 'ITEM_NOT_FOUND' });

    // removing item from parent subCategories
    if (payload.parent === null) await Model.findByIdAndUpdate(category.parent, { $pull: { subCategories: id } });

    category.set(payload);
    await category.save();

    // adding item to parent subCategories
    if (payload.parent) await Model.findByIdAndUpdate(payload.parent, { $addToSet: { subCategories: id } })

    res.status(200).json(category)
})

const remove = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
    const toDeleted = await Model.findById(id);
    if (!toDeleted) return res.status(404).send({ message: 'ITEM_NOT_FOUND' });
    if (toDeleted.parent) await Model.findByIdAndUpdate(toDeleted.parent, { $pull: { subCategories: id } });
    if (toDeleted.subCategories.length) await Model.updateMany({ _id: { $in: toDeleted.subCategories } }, { $set: { parent: null } });

    const deletedCategory = await Model.findByIdAndRemove(id);
    res.status(200).json(deletedCategory);
})

const listSubCategories = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
        const items = await Model.findById(id).populate('subCategories');
        if (!items) return res.status(404).send({ message: 'ITEM_NOT_FOUND' });
        res.status(200).json(items);
})

const addSubCategory = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
        const subCategory = req.body;

        const newCategory = await Model.create({ ...subCategory, parent: id });
        const updatedCategory = await Model.findByIdAndUpdate(id, { $addToSet: { subCategories: newCategory._id } }, { new: true });
        res.status(200).json(updatedCategory);
})

const removeSubCategory = asyncMiddleware(async (req, res) => {
    const id = req.params.id;
        const subCategoryId = req.params.subCategoryId;

        const updatedCategory = await Model.findByIdAndUpdate(id, { $pull: { subCategories: subCategoryId } }, { new: true });
        await Model.findByIdAndUpdate(subCategoryId, { $set: { parent: null } });

        res.status(200).json(updatedCategory);
})

export default {
    list,
    getCategory,
    create,
    update,
    remove,
    listSubCategories,
    addSubCategory,
    removeSubCategory
}