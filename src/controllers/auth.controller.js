const User = require('../models/user.model')
const asyncMiddleware = require('../middlewares/async.middleware')
const bcyrpt = require('bcrypt')
const jwt = require('../utils/jwt') 
const mailer = require('../utils/mailer')
const crypto = require('crypto')

exports.signup = asyncMiddleware(async (req, res) => {
    const { email, password } = req.body
    const exists = await User.findOne({ email: email })
    if(exists) return res.status(400).json({message: 'USER_ALREADY_EXISTS'})    

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(password, salt)

    const payload = { ...req.body, password: hashedPass }
    const user = await User.create(payload)
    await user.save()
    console.log(user);
    
    res.status(201).json({token: jwt.sign(user)})    
})

exports.login = asyncMiddleware(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email: email })
    if(!user) return res.status(401).json({message: 'INVALID_CREDENTIALS'})

    const isPasswordMatched = await bcyrpt.compare(password, user.password)
    if(!isPasswordMatched) return res.status(401).json({message: 'INVALID_CREDENTIALS'})

    return res.status(200).json({ token: jwt.sign(user) })
})

//? what if the same code is used for 2 different users at the same time ???
exports.forgotPassword = asyncMiddleware(async (req, res) => {
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

exports.forgotPasswordConfirm = asyncMiddleware(async (req, res) => {
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

exports.changePassword = asyncMiddleware(async (req, res) => {
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