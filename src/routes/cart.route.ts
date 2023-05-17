import { Router } from 'express'
import controller from '../controllers/cart.controller';

const router: Router = Router()

router.get('/:id', controller.getOne);
router.delete('/:id', controller.deleteCart);
router.post('/', controller.create);
router.put('/:cartId/:itemId', controller.updateItem);



export default router