import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        // required: true,
        trim: true,
        // minlength: 30
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        default: null
    },
    subCategories: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }],
}, {
    timestamps: true
});

export default mongoose.model('category', Category);