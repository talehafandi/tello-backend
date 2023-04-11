const User = require('../models/user.model')
const asyncMiddleware = require('../middlewares/async.middleware')
const bcyrpt = require('bcrypt')
const jwt = require('../utils/jwt') 

exports.signup = asyncMiddleware(async (req, res) => {
    const data = req.body
    const exists = await User.findOne({ email: data.email })
    if(exists) return res.status(400).json({message: 'USER_ALREADY_EXISTS'})    

    const salt = await bcyrpt.genSalt(12)
    const hashedPass = await bcyrpt.hash(data.password, salt)

    const payload = { ...data, password: hashedPass }
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