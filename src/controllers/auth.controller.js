import User from'../models/user.model.js'
import asyncMiddleware from'../middlewares/async.middleware.js'
import bcyrpt from'bcrypt'
import jwt from'../utils/jwt.js' 
import mailer from'../utils/mailer.js'
import crypto from'crypto'
import { google } from'googleapis'
import config from'../config.js'

const signup = asyncMiddleware(async (req, res) => {
    const { email, password } = req.body
    const exists = await User.findOne({ email: email })
    if(exists) return res.status(400).json({message: 'USER_ALREADY_EXISTS'})    

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(password, salt)

    const payload = { ...req.body, password: hashedPass }
    const user = await User.create(payload)
    await user.save()
    
    res.status(201).json({token: jwt.sign(user)})    
})

const login = asyncMiddleware(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email: email })
    if(!user) return res.status(401).json({message: 'INVALID_CREDENTIALS'})


    const isPasswordMatched = await bcyrpt.compare(password, user.password)
    if(!isPasswordMatched) return res.status(401).json({message: 'INVALID_CREDENTIALS'})

    return res.status(200).json({ token: jwt.sign(user) })
})

//? what if the same code is used for 2 different users at the same time ???
const forgotPassword = asyncMiddleware(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({email: email})
    if(!user) return res.status(404).json({message: 'USER_NOT_FOUND'})

    const code = crypto.randomInt(100000, 999999)
    user.forgotPasswordCode = code
    await user.save()

    setTimeout(() => {
        user.forgotPasswordCode = null
        user.save()
    }, 120000) // code should be deprecated after 2 minutes

    mailer.sendForgotPasswordCode(email, code)
    res.status(200).json({message: "the confirmation code sent to your email!"})
})

const forgotPasswordConfirm = asyncMiddleware(async (req, res) => {
    const { code, newPassword } = req.body
    
    const user = await User.findOne({ forgotPasswordCode: code })
    if(!user) return res.status(404).json({message: 'INVALID_OR_EXPIRED_CODE'})

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(newPassword, salt)

    user.password = hashedPass
    user.forgotPasswordCode = null
    await user.save()

    return res.status(201).json({ token: jwt.sign(user) })

})

const changePassword = asyncMiddleware(async (req, res) => {
    const { oldPassword, newPassword, email } = req.body

    const user = await User.findOne({ email: email })
    if(!user) return res.status(404).json({ message: 'USER_NOT_FOUND' })
    
    const isPasswordMatched = await bcyrpt.compare(oldPassword, user.password)
    if(!isPasswordMatched) return res.status(401).json({message: 'INVALID_CREDENTIALS'})
    
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

const getUrl = (_, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        // prompt: 'consent',
        scope: ['email', 'profile'],
    })
    
    return res.status(201).json({ url })
}

const handleAuth = asyncMiddleware(async (req, res) => {
    const { tokens } = await client.getToken(req.query.code)
    if(!tokens.id_token) return res.status(501).json({message: 'GOOGLE_LOGIN_FAILED'})

    const decoded = jwt.decode(tokens.id_token)
    let user = await User.findOne({ email: decoded.email })

    if(user && !user.oAuth) return res.status(301).json({ message: 'USER_ALREADY_EXISTS' })
    if(user) return res.status(201).json({ token: jwt.sign(user) })

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
    handleAuth
}