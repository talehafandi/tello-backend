const router = require('express').Router();

router.use('/v1/categories', require('./category.route'));
router.use('/v1/products', require('./product.route'));
router.use('/v1/auth', require('./auth.route'))
router.use('/v1/users', require('./user.route'))

module.exports = router;