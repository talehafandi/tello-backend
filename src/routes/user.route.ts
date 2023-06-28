import { Router }  from 'express'
import controller  from '../controllers/user.controller'
import { ParamsDictionary, Query } from 'express-serve-static-core';
import { RequestHandler } from 'express';
import access from '../middlewares/access.middleware'

const router: Router = Router()

router.get('/', controller.list)
router.get('/:id', controller.getOne)

router.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)

router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

export default router