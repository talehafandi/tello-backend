import { Router } from 'express'
import controller from '../controllers/product.controller';
import variantRoute from './variant.route'
import { isAuthorized, roles } from '../middlewares/isAuthorized.middleware';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RequestHandler } from 'express';
import access from '../middlewares/access.middleware'


const router: Router = Router()

router.get('/', controller.list);
router.get('/:id', controller.getItem);
router.get('/:categoryId', controller.listByCategory)

router.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)

router.post('/', isAuthorized([roles.ADMIN]), controller.create);
router.put('/:id', isAuthorized([roles.ADMIN]), controller.update);
router.delete('/:id', isAuthorized([roles.ADMIN]), controller.remove);

// variant-groups
router.post('/:productId/variant-groups', controller.createVariantGroup)
router.put('/:productId/variant-groups/:groupId', controller.updateVariantGroup)
router.delete('/:productId/variant-groups/:groupId', controller.deleteVariantGroup)

// variants
//? ERROR
router.use('/:productId/variants', variantRoute)

export default router