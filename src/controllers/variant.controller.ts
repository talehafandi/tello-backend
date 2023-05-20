import Product from '../models/product.model';
import Variant from '../models/variant.model';
import asyncMiddleware from '../middlewares/async.middleware';
import { Req, Res } from '../types/express'
import { ApiError } from '../error/ApiError';

//? when product does't have any variant returns response with 404
const listVariants = asyncMiddleware(async (req: Req, res: Res) => {
    const variants = await Variant.find({ product: req.params.productId })
    if (!variants.length) throw new ApiError('VARIANT_NOT_FOUND', 404)

    res.status(200).json(variants)
})

const getVariant = asyncMiddleware(async (req: Req, res: Res) => {
    const variant = await Variant.findById(req.params.variantId)
    if (!variant) throw new ApiError('VARIANT_NOT_FOUND', 404)

    res.status(200).json(variant)
})

const createVariant = asyncMiddleware(async (req: Req, res: Res) => {
    interface Group { 
        name: string; 
        _id?: string, 
        variants: { 
            name: string; 
            price: number; 
            stock: number; 
        }[]; 
    }
    const { productId, groupId } = req.params;

    const product = await Product.findOne({ _id: productId, "variantGroups._id": groupId });
    if (!product) throw new ApiError('PRODUCT_NOT_FOUND', 404)

    const groupIndex = product.variantGroups.findIndex((group: Group) => group._id == groupId);
    if (groupIndex === -1) throw new ApiError('VARIANT_GROUP_NOT_FOUND', 404)

    // to avoid duplication, gonna find better solution
    const isExist = await Variant.findOne({ name: req.body.name })
    if (isExist) throw new ApiError('VARIANT_ALREADY_EXISTS', 409)

    const variantPayload = { ...req.body, product: productId };
    const variant = await Variant.create(variantPayload);

    const newVariant = {
        name: variant.name,
        _id: variant._id,
        price: variant.price,
        stock: variant.stock,
    };

    product.variantGroups[groupIndex].variants.push(newVariant);
    await product.save();

    res.status(200).json(product)
})

//? must be changed
//? does not avoid the same name for variant in different groups
const updateVariant = asyncMiddleware(async (req: Req, res: Res) => {
    const variantId = req.params.variantId
    const productId = req.params.productId

    const update = {
        $set: {
            'variantGroups.$[group].variants.$[variant].price': req.body.price,
            'variantGroups.$[group].variants.$[variant].stock': req.body.stock,
            'variantGroups.$[group].variants.$[variant].name': req.body.name,
        },
    };

    const options = {
        arrayFilters: [
            { 'group.variants._id': variantId },
            { 'variant._id': variantId },
        ],
        new: true
    };

    const product = await Product.findOneAndUpdate(
        { _id: productId },
        update,
        options,
    );
    if (!product) throw new ApiError('PRODUCT_NOT_FOUND', 404)

    const variant = await Variant.findByIdAndUpdate(variantId, req.body)
    if (!variant) throw new ApiError('VARIANT_NOT_FOUND', 404)

    res.status(200).json(product)
})

const deleteVariant = asyncMiddleware(async (req: Req, res: Res) => {
    const { productId, variantId } = req.params;

    const filter = { _id: productId, "variantGroups.variants._id": variantId }
    const payload = { $pull: { "variantGroups.$.variants": { _id: variantId } } }

    const product = await Product.findOneAndUpdate(filter, payload, { new: true })
    if (!product) throw new ApiError('PRODUCT_NOT_FOUND', 404)

    const variant = await Variant.findByIdAndDelete(variantId)
    if (!variant) throw new ApiError('VARIANT_NOT_FOUND', 404)

    res.status(200).send({
        product,
        variant
    })
})

export default {
    listVariants,
    getVariant,
    updateVariant,
    createVariant,
    deleteVariant
}