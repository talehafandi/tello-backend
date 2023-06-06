import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface ICart extends Document{
    _id: mongoose.Types.ObjectId,
    products: {
        product: mongoose.Types.ObjectId,
        qty: number
    }[],
    variants: {
        variant: mongoose.Types.ObjectId,
        qty: number
    }[],
}

const Cart = new Schema<ICart>({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            // required: true,
        },
        qty: { type: Number, required: true }
    }],
    variants: [{
        variant: {
            type: Schema.Types.ObjectId,
            ref: 'variant',
            // required: true,
        },
        qty: { type: Number, required: true }
    }],
}, { timestamps: true, toJSON: { virtuals: true } })

Cart.virtual("totalPrice").get(function () {
    const productTotal: number = this.products.reduce((sum: number, item: any) => sum + item.product.price * item.qty, 0);
    const variantTotal: number = this.variants.reduce((sum: number, item: any) => sum + item.variant.price * item.qty, 0);
    const total = variantTotal + productTotal

    return total
});

Cart.virtual("totalQty").get(function () {
    const productTotal: number = this.products.reduce((sum: number, item: any) => sum + item.qty, 0);
    const variantTotal: number = this.variants.reduce((sum: number, item: any) => sum + item.qty, 0);
    
    return variantTotal + productTotal
});

Cart.pre(/^find/, function (next) {
    this.find()
    .populate(
        "products.product",
        "name price"
    )
    .populate(
        "variants.variant",
        "name price"
    )
    next();
});

export default mongoose.model<ICart>('cart', Cart)