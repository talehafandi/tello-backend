import { Router } from 'express';
import category from './category.route.js'
import product from './product.route.js'
import auth from './auth.route.js'
import user from './user.route.js'

const router = Router()

router.use('/v1/categories', category);
router.use('/v1/products', product);
router.use('/v1/auth', auth)
router.use('/v1/users', user)

export default router