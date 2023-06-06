import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { Document } from "mongoose";

enum Role {
    CARD = 'card',
    CASH = 'cash'

}

interface IOrder extends Document {
    customer: mongoose.Types.ObjectId | null,
    total: number,
    payment: Role,
    products: [{
        name: string,
        price: number,
        currency: 'usd',
        qty: number
    }],
}

const Order = new Schema<IOrder>({
    customer: mongoose.Types.ObjectId,
    total: Number,
    payment: {
        type: String,
        enum: Role,
        default: Role.CARD
    },
    products: [{
        name: String,
        price: Number,
        currency: { type: String, default: 'usd' },
        qty: Number
    }]
})

export default mongoose.model<IOrder>('order', Order)