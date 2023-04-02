const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        // required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    variantGroups: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        
        variants: [{
            name: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: Number, required: true }
        }],
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    }],
    // images: [{
    //     type: String,
    //     required: true,
    // }],
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    stock: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 0,
    },
    // reviews: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'review',
    // }],
    sortOrder: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });


module.exports = mongoose.model('product', Product);