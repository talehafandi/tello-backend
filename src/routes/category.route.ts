import { Router } from 'express';
import controller from '../controllers/category.controller';
import { isAuthorized, roles } from '../middlewares/isAuthorized.middleware';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RequestHandler } from 'express';
import access from '../middlewares/access.middleware'

const router: Router = Router()

router.get('/', controller.list);
router.get('/:id/sub-categories', controller.listSubCategories);

router.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)
router.use(isAuthorized([roles.ADMIN]))

router.post('/', controller.create);
router.get('/:id', controller.getCategory);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/sub-category', controller.addSubCategory);
router.put('/:id/sub-category/:subCategoryId', controller.removeSubCategory);


export default router;