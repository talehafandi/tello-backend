import { Router } from 'express';
import category from './category.route'
import product from './product.route'
import auth from './auth.route'
import user from './user.route'
import cart from './cart.route'

const router: Router = Router()

router.use('/v1/categories', category);
router.use('/v1/products', product);
router.use('/v1/auth', auth)
router.use('/v1/users', user)
router.use('/v1/carts', cart)


export default router