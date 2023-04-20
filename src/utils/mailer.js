const config = require('../config')
const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    },
})

exports.sendForgotPasswordCode = (to, code) => {
    const options = {
        from: config.mailer.user,
        to,
        subject: 'Forgot Password',
        html: `<h1>The code is: ${code}</h1>`
    }
    
    try {
        transport.sendMail(options)
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'SERVER_ERROR'})
    }
}
