const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    port: process.env.PORT || 6006,
    db: {
        uri: process.env.DB_URI,
        pass: process.env.DB_PASS,
    },
    google:{
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_url: process.env.GOOGLE_REDIRECT
    },
    mailer:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    jwt_sign: process.env.JWT_SIGN,
}