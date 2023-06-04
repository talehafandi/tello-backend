import Model from '../models/category.model';
import asyncMiddleware from '../middlewares/async.middleware'
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError';

const list = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const categories = await Model.find({ parent: null })
        .populate({ path: 'subCategories', select: "_id name slug" });
    return res.status(200).json(categories);
})

const getCategory = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const category = await Model.findById(id)
        .populate({ path: 'subCategories', select: "_id name slug" });

    if (!category) throw new ApiError('ITEM_NOT_FOUND', 404)

    return res.status(200).json(category);
})

const create = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const category = await Model.create(req.body);
    if (category.parent) await Model.findByIdAndUpdate(category.parent, { $addToSet: { subCategories: category._id } });

    return res.status(201).json(category);
})

const update = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const payload = req.body;
    if (payload.subCategories) delete payload.subCategories;

    const category = await Model.findById(id)
    if (!category) throw new ApiError('ITEM_NOT_FOUND', 404)

    // removing item from parent subCategories
    if (payload.parent === null) await Model.findByIdAndUpdate(category.parent, { $pull: { subCategories: id } });

    category.set(payload);
    await category.save();

    // adding item to parent subCategories
    if (payload.parent) await Model.findByIdAndUpdate(payload.parent, { $addToSet: { subCategories: id } })

    return res.status(200).json(category)
})
// TODO test it again
const remove = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const item = await Model.findById(id);

    if (!item) throw new ApiError('ITEM_NOT_FOUND', 404)

    const removeFromParent = { $pull: { subCategories: id } }
    if (item.parent) await Model.findByIdAndUpdate(item.parent, removeFromParent);

    if (item.subCategories.length) await Model.updateMany(
        { _id: { $in: item.subCategories } },
        { $set: { parent: null } }
    );

    const deletedCategory = await Model.findByIdAndRemove(id);
    return res.status(200).json(deletedCategory);
})

const listSubCategories = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const items = await Model.findById(id).populate('subCategories');
    if (!items) throw new ApiError('ITEM_NOT_FOUND', 404)
    return res.status(200).json(items);
})

const addSubCategory = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const subCategory = req.body;

    const newCategory = await Model.create({ ...subCategory, parent: id });

    const addQuery = { $addToSet: { subCategories: newCategory._id } }
    const updatedCategory = await Model.findByIdAndUpdate(id, addQuery, { new: true });

    return res.status(200).json(updatedCategory);
})

const removeSubCategory = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const id = req.params.id;
    const subCategoryId = req.params.subCategoryId;

    const removeQuery = { $pull: { subCategories: subCategoryId } }
    const updatedCategory = await Model.findByIdAndUpdate(id, removeQuery, { new: true });
    await Model.findByIdAndUpdate(subCategoryId, { $set: { parent: null } });

    return res.status(200).json(updatedCategory);
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