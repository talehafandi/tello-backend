const router = require('express').Router();

router.use('/v1/categories', require('./category.route'));
router.use('/v1/products', require('./product.route'));

module.exports = router;