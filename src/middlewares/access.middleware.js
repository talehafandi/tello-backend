const jwt = require('../utils/jwt')

const bypass = [
    '/api/v1/auth/login',
    '/api/v1/auth/signup',
    '/api/v1/auth/change-password',
    '/api/v1/auth/google-url',
    '/api/v1/auth/google',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/forgot-password/confirm',
]

module.exports = (req, res, next) => {
    console.log(req.path, bypass.includes(req.path))
    if (bypass.includes(req.path)) return next()
    
    let token = req.headers.authorization || (req.cookie?.token)
    if (!token) return res.status(403).send({ message: 'Token not provided' })

    try {
        req.user = jwt.validate(token)
        next()
    } catch (e) {
        return res.status(403).send({ message: 'INVALID_TOKEN' })
    }
}
