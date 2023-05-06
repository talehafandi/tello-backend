import { Request, Response, NextFunction } from 'express'

export interface Req extends Request {
    user: {
        firstname: string,
        lastname: string,
        id: Object,
        iat: number,
        eat: number
    }
}

export interface Res extends Response {}
export interface Next extends NextFunction {}
