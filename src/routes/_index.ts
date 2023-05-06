import { Router } from 'express';
import category from './category.route'
import product from './product.route'
import auth from './auth.route'
import user from './user.route'

const router: Router = Router()

router.use('/v1/categories', category);
router.use('/v1/products', product);
router.use('/v1/auth', auth)
router.use('/v1/users', user)

export default router