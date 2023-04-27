import Product from '../models/product.model.js';
import Variant from '../models/variant.model.js';
import asyncMiddleware from '../middlewares/async.middleware.js';

//? when product does't have any variant returns response with 404
const listVariants = asyncMiddleware(async (req, res) => {
    const variants = await Variant.find({ product: req.params.productId })
    if (!variants.length) return res.status(404).json({ message: "NOT_FOUND" })

    res.status(200).json(variants)
})

const getVariant = asyncMiddleware(async (req, res) => {
    const variant = await Variant.findById(req.params.variantId)
    if (!variant) return res.status(404).json({ message: "ITEM_NOT_FOUND" })

    res.status(200).json(variant)
})

const createVariant = asyncMiddleware(async (req, res) => {
    const { productId, groupId } = req.params;
    
    const product = await Product.findOne({ _id: productId, "variantGroups._id": groupId });
    if (!product) return res.status(404).json({ message: "ITEM_NOT_FOUND" });

    const groupIndex = product.variantGroups.findIndex((group) => group._id == groupId);
    if (groupIndex === -1) return res.status(404).json({ message: "VARIANT_GROUP_NOT_FOUND" });

    // to avoid duplication, gonna find better solution
    const isExist = await Variant.findOne({ name: req.body.name })
    if (isExist) return res.status(400).json({ message: "VARIANT_ALREADY_EXISTS" })

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
//? avoids the same name for variant in different groups
const updateVariant = asyncMiddleware(async (req, res) => {
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
    if(!product) return res.status(404).json({message: "ITEM_NOT_FOUND"}) 

    const variant = await Variant.findByIdAndUpdate(variantId, req.body)
    if (!variant) return res.status(404).json({message: "VARIANT_NOT_FOUND"}) 

    res.status(200).json(product)
})

const deleteVariant = asyncMiddleware(async (req, res) => {
    const { productId, variantId } = req.params;

    const filter = { _id: productId, "variantGroups.variants._id": variantId }
    const payload = { $pull: { "variantGroups.$.variants": { _id: variantId } } }

    const product = await Product.findOneAndUpdate(filter, payload, { new: true })
    if (!product) return res.status(404).json({ message: "PRODUCT_NOT_FOUND" })

    const variant = await Variant.findByIdAndDelete(variantId)
    if (!variant) return res.status(404).json({ message: "VARIANT_NOT_FOUND" })

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