const router = require('express').Router();

router.use('/v1/categories', require('./category.route'));

module.exports = router;