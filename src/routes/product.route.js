import { Router } from 'express'
import controller from '../controllers/product.controller.js';
import variantRoute from './variant.route.js'

const router = Router()

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getItem);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/:categoryId', controller.listByCategory)

// variant-groups
router.post('/:productId/variant-groups', controller.createVariantGroup)
router.put('/:productId/variant-groups/:groupId', controller.updateVariantGroup)
router.delete('/:productId/variant-groups/:groupId', controller.deleteVariantGroup)

// variants
//? ERROR
router.use('/:productId/variants', variantRoute)

export default router