const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    port: process.env.PORT || 6006,
    db: {
        uri: process.env.DB_URI,
        pass: process.env.DB_PASS,
    },
    jwt_sign: process.env.JWT_SIGN,
    mail_user: process.env.MAIL_USER,
    mail_pass: process.env.MAIL_PASS
}