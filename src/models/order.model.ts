import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { Document } from "mongoose";

enum Role {
    CARD = 'card',
    CASH = 'cash'

}

interface IOrder extends Document {
    customer: string,
    total: number,
    currency: string,
    payment: Role,
    customerDetails: object,
    items: {
        name: string,
        price: number,
        currency: 'usd',
        qty: number
    }[],
}

const Order = new Schema<IOrder>({
    customer: String,
    total: Number,
    currency: String,
    payment: {
        type: String,
        enum: Role,
        default: Role.CARD
    },
    customerDetails: Object,
    items: [{
        name: String,
        price: Number,
        currency: { type: String, default: 'usd' },
        qty: Number
    }]
})

export default mongoose.model<IOrder>('order', Order)