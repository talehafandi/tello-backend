import { Router } from 'express';
import controller from '../controllers/auth.controller'

const router: Router = Router()

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/forgot-password', controller.forgotPassword)
router.post('/forgot-password/confirm', controller.forgotPasswordConfirm)
router.post('/change-password', controller.changePassword)
router.get('/google', controller.handleAuth)
router.get('/google-url', controller.getUrl)

export default router