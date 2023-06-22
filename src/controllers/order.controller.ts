import Model from '../models/order.model';
import asyncMiddleware from '../middlewares/async.middleware';
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError';

export interface IOrder {
    customer: string,
    total: number,
    currency: string,
    payment: 'card',
    customerDetails: object,
    items: {
        name: string,
        price: number,
        currency: 'usd',
        qty: number
    }[],
}

const createOrder = async (payload: IOrder) => {
    try {
        await Model.create(payload)
    } catch (error) {
        console.log("Error: ", error);
        throw new ApiError('Something went wrong', 500)       
    }
}

const getOne = asyncMiddleware(async (req: Req, res: Res) => {
    const { orderId } = req.params
    const order = await Model.findById(orderId)

    if (!order) throw new ApiError('ORDER_NOT_FOUND', 404)

    return res.status(200).json({ data: order })
})

const list = asyncMiddleware(async (req: Res, res: Res) => {
    const orders = await Model.find()
    return res.status(200).json({ data: orders })
})

export default {
    createOrder,
    getOne,
    list
}