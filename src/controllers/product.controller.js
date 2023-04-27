import Model from '../models/product.model.js';
import asyncMiddleware from '../middlewares/async.middleware.js';

const list = asyncMiddleware(async (_, res) => {
    const products = await Model.find({})
    // .populate({ path: 'category', select: "_id name slug" });
    res.status(200).json(products);
});

const getItem = asyncMiddleware(async (req, res) => {
    const product = await Model.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'PRODUCT_NOT_FOUND' });
    res.status(200).json(product);
});

const create = asyncMiddleware(async (req, res) => {
    const product = await Model.create(req.body);
    res.status(201).json(product);
});

const update = asyncMiddleware(async (req, res) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
});

const remove = asyncMiddleware(async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
});

const listByCategory = asyncMiddleware(async (req, res) => {
    const products = await Model.find({ categories: { $in: [req.params.categoryId] } })
    // .populate({ path: 'category', select: "_id name slug" });
    res.status(200).json(products);
});

//variant-group
const createVariantGroup = asyncMiddleware(async (req, res) => {
    const productId = req.params.productId;
    const group = req.body;

    // to avoid duplication, gonna find better solution
    const isExist = await Model.findOne({ _id: productId, 'variantGroups.name': group.name })
    if (isExist) return res.status(400).json({ message: 'ITEM_ALREADY_EXISTS' })


    const product = await Model.findByIdAndUpdate(productId, { $addToSet: { variantGroups: group } }, { new: true })

    res.status(200).json(product)
});

const deleteVariantGroup = asyncMiddleware(async (req, res) => {
    const product = await Model.findOneAndUpdate(
        { _id: req.params.productId },
        { $pull: { variantGroups: { _id: req.params.groupId } } },
        { new: true }
    );
    res.status(200).json(product)
})

//? look again - might be wrong query
const updateVariantGroup = asyncMiddleware(async (req, res) => {
    const data = req.body

    // to avoid duplication, gonna find better solution
    const isExist = await Model.findOne({ _id: req.params.productId, 'variantGroups.name': data.name })
    if (isExist) return res.status(400).json({ message: 'ITEM_ALREADY_EXISTS' })

    const filter = { _id: req.params.productId, "variantGroups._id": req.params.groupId }
    const payload = { $set: {} }

    for (let key in data) payload.$set[`variantGroups.$.${key}`] = data[key]

    const product = await Model.findOneAndUpdate(filter, payload, { new: true })

    res.status(200).json(product)
})

export default {
    list,
    getItem,
    create,
    update,
    remove,
    listByCategory,
    createVariantGroup,
    deleteVariantGroup,
    updateVariantGroup
}