import { ApiError } from './../error/ApiError';
import { Req, Res } from './../types/express.d';
import config from "../config";
import Stripe from "stripe";
import asyncMiddleware from "../middlewares/async.middleware";
import Mongoose from 'mongoose';
import Product from '../models/product.model';
import Variant from '../models/variant.model';

const stripe = new Stripe(config.stripe_key, {
    apiVersion: '2022-11-15',
})

const checkout = asyncMiddleware(async (req: Req, res: Res) => {
    const { items, email } = req.body

    type Item = {
        _id: Mongoose.Schema.Types.ObjectId,
        name: string,
        price: number,
        qty: number
    }

    const line_items = await Promise.all(
        items.map(async (item: Item) => {
            const query = {
                _id: item._id,
                stock: { $gte: item.qty },
                name: item.name,
                price: item.price,
            };
            const line_item = await Product.findOne(query) ||  await Variant.findOne(query)
            if (!line_item) throw new ApiError('ITEM_NOT_FOUND_OR_OUT_OF_STOCK', 404);
            
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.qty,
            };
        })
    );

    const session = await stripe.checkout.sessions.create({
        line_items,
        payment_method_types: ["card"],
        mode: 'payment',
        customer_creation: 'always',
        customer_email: email,
        success_url: config.server_url,
        cancel_url: config.server_url + '/payment-error'
    })

    return res.status(200).json({ session })
    // return res.redirect(session.url as string)
})

export default {
    checkout
}