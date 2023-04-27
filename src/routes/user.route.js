import { Router }  from 'express'
import controller  from '../controllers/user.controller.js'

const router = Router()

router.get('/', controller.list)
router.get('/:id', controller.getOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

export default router