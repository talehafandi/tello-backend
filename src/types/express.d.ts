import { Request, Response, NextFunction } from 'express'
import { ReqUser } from './types'

export interface Req extends Request {
    user: ReqUser
}

export interface Res extends Response {}
export interface Next extends NextFunction {}
