const jwt = require('../utils/jwt')
const User = require('../models/user.model')

const bypass = [
    '/api/v1/auth/login',
    '/api/v1/auth/signup',
    '/api/v1/auth/change-password',
    '/api/v1/auth/google-url',
    '/api/v1/auth/google',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/forgot-password/confirm',
]

module.exports = async (req, res, next) => {
    console.log(req.path, bypass.includes(req.path))
    if (bypass.includes(req.path)) return next()
    
    let token = req.headers.authorization || (req.cookie?.token)
    if (!token) return res.status(403).send({ message: 'Token not provided' })

    try {
        req.user = jwt.verify(token)
        const user = await User.findById(req.user.id)
        if(!user) return res.status(404).send({ message: 'USER_NOT_FOUND' })
        next()
    } catch (e) {
        let message = 'INVALID_TOKEN'
        if(e.message == 'jwt expired') message = 'TOKEN_EXPIRED'
        return res.status(403).send({ message })
    }
}
