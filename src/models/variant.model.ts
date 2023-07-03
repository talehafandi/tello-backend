import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface IAsset {
    _id: mongoose.Types.ObjectId;
}

interface IVariant extends Document {
    name: string;
    product: mongoose.Types.ObjectId;
    description?: string;
    active: boolean;
    price: number;
    sku: string;
    stock: number;
    cover: IAsset;
    assets: IAsset[]
    createdAt: Date;
    updatedAt: Date;
  }

const Variant = new Schema<IVariant>({
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
    cover: {
        type: Schema.Types.ObjectId,
        ref: 'asset',
        // required: true,
    },
    assets: [{
        type: Schema.Types.ObjectId,
        ref: 'asset',
        // required: true,
    }],
});

Variant.pre(/^find/, function (next) {
    this.find()
    .populate({ path: 'assets cover', select: "url" });
    next();
});

export default mongoose.model<IVariant>('variant', Variant);
