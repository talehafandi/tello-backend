import { Router } from "express";
import controller from "../controllers/asset.controller";
import multer from '../utils/multer'
const router: Router = Router()

router.post('/', multer.single('asset'), controller.upload)
router.delete('/:id', controller.remove)

export default router