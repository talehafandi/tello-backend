import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface IProductVariant {
    name: string;
    price: number;
    stock: number;
  }
  
  interface IProductCategory {
    _id: mongoose.Types.ObjectId;
  }
  
  interface IProduct extends Document {
    name: string;
    description?: string;
    slug: string;
    active: boolean;
    price: number;
    variantGroups: Array<{
      name: string;
      variants: IProductVariant[];
    }>;
    categories: IProductCategory[];
    sku: string;
    stock: number;
    sold: number;
    rating: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }

const Product = new Schema<IProduct>({
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


export default mongoose.model<IProduct>('product', Product);