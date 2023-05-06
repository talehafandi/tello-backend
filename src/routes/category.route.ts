import { Router } from 'express';
import controller from '../controllers/category.controller';

const router: Router = Router()

router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.getCategory);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.put('/:id/sub-category', controller.addSubCategory);
router.put('/:id/sub-category/:subCategoryId', controller.removeSubCategory);
router.get('/:id/sub-categories', controller.listSubCategories);


export default router;