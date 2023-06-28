import User from "../models/user.model"
import { Req, Res, Next } from "../types/express"
import asyncMiddleware from "./async.middleware"


export const roles = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
}

export const isAuthorized = (accessList: string[]) => {
    return asyncMiddleware(async (req: Req, res: Res, next: Next) => {
        // console.log("req.user: ", req.user);

        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "USER_NOT_FOUND" })

        if (accessList.includes(user.role)) return next()

        return res.status(403).json({ message: "FORBIDDED" })
    })
}
