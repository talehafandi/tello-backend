const Model = require('../models/product.model');
const VariantModel = require('../models/variant.model')
const asyncMiddleware = require('../middlewares/async.middleware');

exports.list = asyncMiddleware(async (_, res) => {
    const products = await Model.find({})
    // .populate({ path: 'category', select: "_id name slug" });
    res.status(200).json(products);
});

exports.getItem = asyncMiddleware(async (req, res) => {
    const product = await Model.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'PRODUCT_NOT_FOUND' });
    res.status(200).json(product);
});

exports.create = asyncMiddleware(async (req, res) => {
    const product = await Model.create(req.body);
    res.status(201).json(product);
});

exports.update = asyncMiddleware(async (req, res) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
});

exports.remove = asyncMiddleware(async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
});

exports.listByCategory = asyncMiddleware(async (req, res) => {
    const products = await Model.find({ categories: { $in: [req.params.categoryId] } })
    // .populate({ path: 'category', select: "_id name slug" });
    res.status(200).json(products);
});

//variant-group
//? duplicate names - index it
exports.createVariantGroup = asyncMiddleware(async (req, res) => {
    const productId = req.params.productId;
    const group = req.body;

    const product = await Model.findByIdAndUpdate(productId, { $addToSet: { variantGroups: group } }, { new: true })
    res.status(200).json(product)
});

exports.deleteVariantGroup = asyncMiddleware(async (req, res) => {
    const product = await Model.findOneAndUpdate(
        { _id: req.params.productId },
        { $pull: { variantGroups: { _id: req.params.groupId } } },
        { new: true }
    );
    res.status(200).json(product)
})

//? look again - might be wrong query
exports.updateVariantGroup = asyncMiddleware(async (req, res) => {
    const data = req.body

    const filter = { _id: req.params.productId, "variantGroups._id": req.params.groupId }
    const payload = { $set: {} }

    for (let key in data) payload.$set[`variantGroups.$.${key}`] = req.body[key]

    const product = await Model.findOneAndUpdate(filter, payload, { new: true })

    res.status(200).json(product)
})

//variant
//? when product does't have any variant returns response with 404
exports.listVariants = asyncMiddleware(async (req, res) => {
    const variants = await VariantModel.find({product: req.params.productId})
    // if(!variants.length) return res.status(404).json({message: "NOT_FOUND"})

    res.status(200).json(variants)
})

exports.getVariant = asyncMiddleware(async (req, res) => {
    const variant = await VariantModel.findById(req.params.variantId)
    if(!variant) return res.status(404).json({message: "ITEM_NOT_FOUND"})

    res.status(200).json(variant)
})

//? Creates variants with same name
exports.createVariant = asyncMiddleware(async (req, res) => {
    const { productId, groupId } = req.params;

    const product = await Model.findOne({ _id: productId, "variantGroups._id": groupId });
    if (!product) return res.status(404).json({ message: "ITEM_NOT_FOUND" });

    const groupIndex = product.variantGroups.findIndex((group) => group._id == groupId);
    // if (groupIndex === -1) return res.status(404).json({ message: "VARIANT_GROUP_NOT_FOUND" });
    
    // const variantPayload = { ...req.body, product: productId };
    const variant = await VariantModel.create({ ...req.body, product: productId });

    // const newVariant = {
    //     name: variant.name,
    //     _id: variant._id,
    //     price: variant.price,
    //     stock: variant.stock,
    // };

    product.variantGroups[groupIndex].variants.push({
        name: variant.name,
        _id: variant._id,
        price: variant.price,
        stock: variant.stock,
    });
    await product.save();

    res.status(200).json(product)
})

exports.deleteVariant = asyncMiddleware(async (req, res) => {
    const { productId, variantId } = req.params;

    const filter = { _id: productId, "variantGroups.variants._id": variantId }
    const payload = { $pull: { "variantGroups.$.variants": { _id: variantId } } }

    const product = await Model.findOneAndUpdate(filter, payload, { new: true })
    if (!product) return res.status(404).json({message: "PRODUCT_NOT_FOUND"}) 

    const variant = await VariantModel.findByIdAndDelete(variantId)
    if (!variant) return res.status(404).json({message: "VARIANT_NOT_FOUND"}) 

    res.status(200).send({
        product, 
        variant
    })
})