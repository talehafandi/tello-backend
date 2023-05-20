import { ApiError } from "./ApiError"
import { Request, Response, NextFunction } from "express"

export default (error: ApiError, req: Request, res: Response, next: NextFunction) => {    
    if(!error.operational){
        error.message = 'Something went wrong'
        error.status = 500
    }
    res.status(error.status).json({ success: false, message: error.message });
}