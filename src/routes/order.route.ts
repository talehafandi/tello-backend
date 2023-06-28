import { Router } from 'express'
import controller from '../controllers/order.controller';

const router: Router = Router()

router.get('/:orderId', controller.getOne)
router.get('/', controller.list)

export default router