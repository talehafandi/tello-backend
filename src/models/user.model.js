const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    address: {
        country: { type: String },
        city: { type: String },
        street: { type: String },
        zipCode: { type: String }
    },
    // sex: { type: String, enum: ['m', 'f'] },
    role: { type: String, default: 'user' },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true },
    phone: {
        type: String,
        // unique: true
    },
    lastLogin:{
        type: String
    },    
    forgotPasswordCode: { type: String },
    oAuth: { type: Boolean, default: false }
    // expiresAt: {
    //     type: Date,
    //     expires: '60',
    //     index: true,
    //     default: Date.now,
    // },
})

module.exports = mongoose.model('user', User);
