import { Router } from 'express';
import controller from '../controllers/auth.controller'
import access from '../middlewares/access.middleware';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RequestHandler } from 'express';

const router: Router = Router()

// no need to login
router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/forgot-password', controller.forgotPassword)
router.post('/forgot-password/confirm', controller.forgotPasswordConfirm)
router.get('/google', controller.handleAuth)
router.get('/google-url', controller.getUrl)

// auth middleware
router.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)

router.post('/change-password', controller.changePassword)


export default router