import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { Types } from 'mongoose'
import { ReqUser } from '../types/types'

interface IUser {
    _id: Types.ObjectId,
    firstname: string,
    lastname: string
}

export const sign = (user: IUser) => {
    // console.log("user: ", user);
    let claims = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname
    }
    // console.log("claims: ", claims);
    // console.log(config.jwt.expire);
    return jsonwebtoken.sign(
        claims, 
        config.jwt.sign,
        { expiresIn: config.jwt.expire }
    )
}

export const verify = function (token: string) {
    return jsonwebtoken.verify(token, config.jwt.sign) as ReqUser
}

export const decode = (token: string) => jsonwebtoken.decode(token)

export default {
    sign,
    verify,
    decode
}
