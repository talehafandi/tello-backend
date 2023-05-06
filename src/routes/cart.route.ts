import { Router } from 'express'
import controller from '../controllers/cart.controller.js';

const router: Router = Router()

router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.post('/:id', controller.update);


export default router