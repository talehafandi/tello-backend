import { Router } from 'express';
import category from './category.route'
import product from './product.route'
import auth from './auth.route'
import user from './user.route'
import cart from './cart.route'
import checkout from './checkout.route'
import order from './order.route'
import asset from './asset.route'

const router: Router = Router()

router.use('/v1/categories', category);
router.use('/v1/products', product);
router.use('/v1/auth', auth)
router.use('/v1/users', user)
router.use('/v1/carts', cart)
router.use('/v1/checkout', checkout)
router.use('/v1/orders', order)
router.use('/v1/assets', asset)


export default router