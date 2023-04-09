const router = require('express').Router({
    mergeParams: true
});
const controller = require('../controllers/variant.controller');

router.get('/:variantId', controller.getVariant)
router.get('/', controller.listVariants)
router.post('/:groupId', controller.createVariant)
router.put('/:variantId', controller.updateVariant)
router.delete('/:variantId', controller.deleteVariant)

module.exports = router;
