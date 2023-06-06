import Model from '../models/order.model';
import asyncMiddleware from '../middlewares/async.middleware';
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError';

const create = asyncMiddleware(async (req: Req, _res: Res) => {
    const payload = req.body
    await Model.create(payload)
})

const getOne = asyncMiddleware(async (req: Req, res: Res) => {
    const { orderId } = req.params
    const order = await Model.findById(orderId)

    if(!order) throw new ApiError('ORDER_NOT_FOUND', 404)

    return res.status(200).json({ data: order })
})

const list = asyncMiddleware(async (req: Res, res: Res) => {
    const orders = await Model.find()
    return res.status(200).json({ data: orders })
})

export default {
    create,
    getOne,
    list
}