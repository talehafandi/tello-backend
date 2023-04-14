const config = require('../config')
const nodemailer = require('nodemailer')
const asyncMiddleware = require('../middlewares/async.middleware')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mail_user,
        pass: config.mail_pass
    },
})

exports.sendForgotPasswordCode = asyncMiddleware(async (to, code) => {
    const options = {
        from: config.mail_user,
        to,
        subject: 'Forgot Password',
        html: `<h1>The code is: ${code}</h1>`
    }

    transport.sendMail(options)
})