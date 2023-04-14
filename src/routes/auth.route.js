const router = require('express').Router();
const controller = require('../controllers/auth.controller')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/forgot-password', controller.forgotPassword)
router.post('/forgot-password/confirm', controller.forgotPasswordConfirm)
router.post('/change-password', controller.changePassword)


module.exports = router