const router = require('express').Router()
const controller = require('../controllers/user.controller')

router.get('/', controller.list)
router.get('/:id', controller.getOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router