import Model from '../models/product.model';
import asyncMiddleware from '../middlewares/async.middleware';
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError';

const list = asyncMiddleware(async (_req: Req, res: Res): Promise<Res> => {
    const products = await Model.find({})
    return res.status(200).json(products);
});

const getItem = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const product = await Model.findById(req.params.id)
    if (!product) throw new ApiError('ITEM_NOT_FOUND', 404)
    return res.status(200).json(product);
});

//? there is no limit for assets of product
const create = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const product = await Model.create(req.body);
    return res.status(201).json(product);
});

const update = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updated);
});

const remove = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    return res.status(200).json(deleted);
});

const listByCategory = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const products = await Model.find({ categories: { $in: [req.params.categoryId] } })
    // .populate({ path: 'category', select: "_id name slug" });
    return res.status(200).json(products);
});

//variant-group
const createVariantGroup = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const productId = req.params.productId;
    const group = req.body;

    // to avoid duplication, gonna find better solution
    const isExist = await Model.findOne({ _id: productId, 'variantGroups.name': group.name })
    if (isExist) throw new ApiError('ITEM_ALREADY_EXISTS', 409)


    const product = await Model.findByIdAndUpdate(productId, { $addToSet: { variantGroups: group } }, { new: true })

    return res.status(200).json(product)
});

const deleteVariantGroup = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const product = await Model.findOneAndUpdate(
        { _id: req.params.productId },
        { $pull: { variantGroups: { _id: req.params.groupId } } },
        { new: true }
    );
    return res.status(200).json(product)
})

//? look again - might be wrong query
const updateVariantGroup = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const data = req.body

    // to avoid duplication, gonna find better solution
    const isExist = await Model.findOne({ _id: req.params.productId, 'variantGroups.name': data.name })
    if (isExist) throw new ApiError('ITEM_ALREADY_EXISTS', 409)

    const filter = { _id: req.params.productId, "variantGroups._id": req.params.groupId }
    const payload: Record<string, any> = { $set: {} }

    for (let key in data) payload.$set[`variantGroups.$.${key}`] = data[key]

    const product = await Model.findOneAndUpdate(filter, payload, { new: true })

    return res.status(200).json(product)
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