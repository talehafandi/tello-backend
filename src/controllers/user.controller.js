import User from '../models/user.model.js'
import asyncMiddleware from '../middlewares/async.middleware.js'

const list = asyncMiddleware(async(req, res) => {
    const users = await User.find().select('-password')
    return res.status(201).json(users)
})

const getOne = asyncMiddleware(async(req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({ message: 'USER_NOT_FOUND' })

    return res.status(201).json(user)
})

const update = asyncMiddleware(async (req, res) => {
    const payload = req.body
    const { id } = req.params
    
    const user = await User.findByIdAndUpdate(id, payload, { new: true })
    if(!user) return res.status(404).json({ message: 'USER_NOT_FOUND' })
    if(user._id != req.user.id) return res.status(403).json({ message: 'UNAUTHORIZED_ACTION' })

    return res.status(201).json(user)
})  

const remove = asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({ message: 'USER_NOT_FOUND' })
    if(user._id != req.user.id) return res.status(403).json({ message: 'UNAUTHORIZED_ACTION' })

    await User.findByIdAndRemove(req.params.id)
    return res.status(201).json(user)
})

export default {
    list,
    getOne,
    update,
    remove
}