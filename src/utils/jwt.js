const jsonwebtoken = require('jsonwebtoken')
const config = require('../config')

const operations = {}

operations.sign = (user) => {
    // console.log("user: ", user);
    let claims = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname
    }
    // console.log("claims: ", claims);
    return jsonwebtoken.sign(JSON.stringify(claims), config.jwt_sign)
}

operations.validate = function (token) {
    return jsonwebtoken.verify(token, config.jwt_sign)
}

module.exports = operations
