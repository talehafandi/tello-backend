import jwt from'../utils/jwt'
import User from'../models/user.model'
import { Response, NextFunction } from 'express';
import { Req } from '../types/express'

const bypass = [
    '/api/v1/auth/login',
    '/api/v1/auth/signup',
    '/api/v1/auth/change-password',
    '/api/v1/auth/google-url',
    '/api/v1/auth/google',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/forgot-password/confirm',
]

export default async (req: Req, res: Response, next: NextFunction) => {
    console.log(req.path, bypass.includes(req.path))
    if (bypass.includes(req.path)) return next()
    
    let token = req.headers.authorization || (req.cookies?.token)
    if (!token) return res.status(403).send({ message: 'Token not provided' })

    try {
        req.user = jwt.verify(token)
        const user = await User.findById(req.user.id)
        if(!user) return res.status(404).send({ message: 'USER_NOT_FOUND' })
        next()
    } catch (e: any) {
        let message = 'INVALID_TOKEN'
        if(e.message == 'jwt expired') message = 'TOKEN_EXPIRED'
        return res.status(403).send({ message })
    }
}
