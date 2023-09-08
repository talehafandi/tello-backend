import User from '../models/user.model'
import asyncMiddleware from '../middlewares/async.middleware'
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError'
import { Types } from 'mongoose'

const list = asyncMiddleware(async (_req: Req, res: Res): Promise<Res> => {
    const users = await User.find()
    return res.status(201).json(users)
})

const getOne = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { id } = req.params
    if (!Types.ObjectId.isValid(id)) throw new ApiError('INVALID_ID', 400)

    const user = await User.findById(id)
    if (!user) throw new ApiError('USER_NOT_FOUND', 404)

    return res.status(201).json(user)
})

const update = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const payload = req.body
    const { id } = req.params
    if (!Types.ObjectId.isValid(id)) throw new ApiError('INVALID_ID', 400)

    const user = await User.findByIdAndUpdate(id, payload, { new: true })
    if (!user) throw new ApiError('USER_NOT_FOUND', 404)
    if (user._id != req.user.id) throw new ApiError('FORBIDDED', 403)

    return res.status(201).json(user)
})

const remove = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'USER_NOT_FOUND' })
    if (user._id != req.user.id) throw new ApiError('FORBIDDED', 403)

    await User.findByIdAndRemove(req.params.id)
    return res.status(201).json(user)
})

export default {
    list,
    getOne,
    update,
    remove
}