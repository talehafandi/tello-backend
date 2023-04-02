const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Variant = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    // images: [{
    //     type: String,
    //     required: true,
    // }],
});

module.exports = mongoose.model('variant', Variant);
