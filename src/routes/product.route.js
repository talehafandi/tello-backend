const router = require('express').Router();
const controller = require('../controllers/product.controller');

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
router.get('/variants/:variantId', controller.getVariant)
router.get('/:productId/variants/', controller.listVariants)
router.post('/:productId/variants/:groupId', controller.createVariant)
router.delete('/:productId/variants/:variantId', controller.deleteVariant)

module.exports = router;