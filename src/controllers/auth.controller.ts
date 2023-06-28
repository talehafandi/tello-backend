import { ApiError } from './../error/ApiError';
import User from '../models/user.model'
import asyncMiddleware from '../middlewares/async.middleware'
import bcyrpt from 'bcrypt'
import jwt from '../utils/jwt'
// import mailer from '../utils/mailer.js'
import * as mailer from '../utils/mailer'
import crypto from 'crypto'
import { google } from 'googleapis'
import config from '../config'
import { Req, Res, Next } from '../types/express'
import { IUser } from '../models/user.model'

//? user can be created once instead of exists
const signup = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { email, password } = req.body
    const exists = await User.findOne({ email: email })
    if (exists) throw new ApiError('USER_ALREADY_EXISTS', 409)

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(password, salt)

    const payload = { ...req.body, password: hashedPass }
    const user: IUser = await User.create(payload)
    await user.save()

    return res.status(201).json({ token: jwt.sign(user) })
})

const login = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { email, password } = req.body

    const user: IUser | null = await User.findOne({ email: email }).select('+password')
    if (!user) throw new ApiError('INVALID_CREDENTIALS', 401)

    const isPasswordMatched = await bcyrpt.compare(password, user.password)
    if (!isPasswordMatched) throw new ApiError('INVALID_CREDENTIALS', 401)

    return res.status(200).json({ token: jwt.sign(user) })
})

//? what if the same code is used for 2 different users at the same time ???
const forgotPassword = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { email } = req.body

    const user: IUser | null = await User.findOne({ email: email })
    if (!user) throw new ApiError('USER_NOT_FOUND', 404)

    const code = crypto.randomInt(100000, 999999)
    user.forgotPasswordCode = code
    await user.save()

    setTimeout(() => {
        user.forgotPasswordCode = null
        user.save()
    }, 120000) // code should be deprecated after 2 minutes
    mailer.sendForgotPasswordCode(email, code)
    return res.status(200).json({ message: "the confirmation code sent to your email!" })
})

const forgotPasswordConfirm = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { code, newPassword } = req.body

    const user: IUser | null= await User.findOne({ forgotPasswordCode: code })
    if (!user) throw new ApiError('INVALID_OR_EXPIRED_CODE', 400)

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(newPassword, salt)

    user.password = hashedPass
    user.forgotPasswordCode = null
    await user.save()

    return res.status(201).json({ token: jwt.sign(user) })

})
//?
const changePassword = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const { oldPassword, newPassword, email } = req.body
    
    const user: IUser | null = await User.findOne({ email: email }).select('+password')
    if (!user) throw new ApiError('USER_NOT_FOUND', 404)
    if (user._id != req.user.id) throw new ApiError('FORBIDDED', 403)

    const isPasswordMatched = await bcyrpt.compare(oldPassword, user.password)
    if (!isPasswordMatched) throw new ApiError('INVALID_CREDENTIALS', 401)

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(newPassword, salt)
    user.password = hashedPass
    await user.save()

    return res.status(201).json({ token: jwt.sign(user) })
})

//? GOOGLE AUTH

const client = new google.auth.OAuth2(
    config.google.client_id,
    config.google.client_secret,
    config.google.redirect_url
)

// TODO: Does not work w/o asyncMiddleware
const getUrl =  asyncMiddleware(async (_req: Req, res: Res): Promise<Res> => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        // prompt: 'consent',
        scope: ['email', 'profile'],
    })

    return res.status(201).json({ url })
})

const handleAuth = asyncMiddleware(async (req: Req, res: Res): Promise<Res> => {
    const code: string = req.query.code as string
    const { tokens } = await client.getToken(code)
    if (!tokens.id_token) throw new ApiError('GOOGLE_LOGIN_FAILED', 401)

    interface Decoded {
        email: string,
        given_name: string,
        family_name: string
    }
    const decoded: Decoded = jwt.decode(tokens.id_token) as Decoded
    
    let user: IUser | null = await User.findOne({ email: decoded.email }).select('+oAuth')

    if (user && !user.oAuth) throw new ApiError('USER_ALREADY_EXISTS', 409)
    if (user) return res.status(201).json({ token: jwt.sign(user) })

    user = await User.create({
        firstname: decoded.given_name,
        lastname: decoded.family_name,
        email: decoded.email,
        password: Math.random().toString(36).slice(-8),
        oAuth: true,
        lastLogin: Date.now()
    })

    return res.status(201).json({ token: jwt.sign(user) })
})

export default {
    login,
    signup,
    changePassword,
    forgotPassword,
    forgotPasswordConfirm,
    getUrl,
    handleAuth,
}