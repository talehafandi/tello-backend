import { Response, Request, Router } from 'express';
import controller from '../controllers/checkout.controller';
import bodyParser from 'body-parser';

const router: Router = Router()
// const link = 'https://checkout.stripe.com/c/pay/cs_test_a1YP6Pw2yAIdmu0zX6no9S8eXhRXIRiHeeDs3hJCOpcviCCdCdjLYMKkMP#fidkdWxOYHwnPyd1blpxYHZxWjA0S0M0N09CfzF1UVV2PXVAYjNiMWJDaWxcf0lUYDJzTklScmFTRDBwb3ExYW1LNVJtYnR3XUJtSzw8V3JSUGhNUVNpQEE8Z2szQ2lnZzw8bWFRaDZgbDxmNTVwcFFvcHRDVCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'

router.post('/webhook', controller.webhook)

router.post('/', controller.checkout)
// router.get('/', (_req: Request, res: Response) => {
//     res.redirect(link)
// })

export default router