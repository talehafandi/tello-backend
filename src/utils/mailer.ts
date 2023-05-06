import config from '../config'
import nodemailer from 'nodemailer'
import { Req, Res } from '../types/express'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailer.user,
        pass: config.mailer.pass
    },
})

export const sendForgotPasswordCode = (to: string, code: number) => {
    const options = {
        from: config.mailer.user,
        to,
        subject: 'Forgot Password',
        html: `<h1>The code is: ${code}</h1>`
    }

    try {
        // transport.sendMail(options)
        console.log(code);
        
    } catch (error) {
        console.log(error);
        return (_req: Req, res: Res) => res.status(500).json({ message: 'FAILED_TO_SEND_CODE' })
    }
}
