import { Router } from 'express';
import controller from '../controllers/variant.controller.js'

const router = Router({ mergeParams: true })

router.get('/:variantId', controller.getVariant)
router.get('/', controller.listVariants)
router.post('/:groupId', controller.createVariant)
router.put('/:variantId', controller.updateVariant)
router.delete('/:variantId', controller.deleteVariant)

export default router;
