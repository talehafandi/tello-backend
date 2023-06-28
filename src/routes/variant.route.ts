import { Router } from 'express';
import controller from '../controllers/variant.controller'
import { isAuthorized, roles } from '../middlewares/isAuthorized.middleware';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RequestHandler } from 'express';
import access from '../middlewares/access.middleware'

const router: Router = Router({ mergeParams: true })

router.get('/:variantId', controller.getVariant)
router.get('/', controller.listVariants)

router.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)
router.use(isAuthorized([roles.ADMIN]))

router.post('/:groupId', controller.createVariant)
router.put('/:variantId', controller.updateVariant)
router.delete('/:variantId', controller.deleteVariant)

export default router;
