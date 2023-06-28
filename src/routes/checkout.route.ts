import { Router } from 'express';
import controller from '../controllers/checkout.controller';

const router: Router = Router()

router.post('/webhook', controller.webhook)

router.post('/', controller.checkout)

export default router