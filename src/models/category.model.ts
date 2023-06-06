import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface ICategory extends Document {
    name: string;
    description?: string;
    slug: string;
    parent: mongoose.Types.ObjectId | null;
    subCategories: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const Category = new Schema<ICategory>({
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

export default mongoose.model<ICategory>('category', Category);