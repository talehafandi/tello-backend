import { IOrder } from './order.controller';
import { ApiError } from './../error/ApiError';
import { Req, Res } from './../types/express.d';
import config from "../config";
import Stripe from "stripe";
import asyncMiddleware from "../middlewares/async.middleware";
import Mongoose from 'mongoose';
import Product from '../models/product.model';
import Variant from '../models/variant.model';
import orderController from './order.controller';

const stripe = new Stripe(config.stripe.secret, {
    apiVersion: '2022-11-15',
})

// TODO: Code is ugly, needs refactoring

const checkout = asyncMiddleware(async (req: Req, res: Res) => {
    const { items, email } = req.body

    const customer = await stripe.customers.create({
        metadata: {
            items: JSON.stringify(items),
            email: email
        }
    })
    
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
            const line_item = await Product.findOne(query) || await Variant.findOne(query)
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
        customer: customer.id,
        success_url: config.server_url + '/api/v1/checkout/webhook',
        cancel_url: config.server_url + '/payment-error'
    })

    return res.status(200).json({ session })
    // return res.redirect(session.url as string)
})

// webhook

const webhook = asyncMiddleware(async (req: Req, res: Res) => {
    const payload = req.body
    const signature = req.headers['stripe-signature'] as string | string[]
    let customer
    let event  

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            config.stripe.webhook_secret
        );
    } catch (error) {
        return res.sendStatus(400)
    }

    interface IEventData {
        customer: string,
        amount_total: number,
        currency: string,
        customer_details: object,
    }

    const data = event.data.object as IEventData
    // console.log(event.type, event.type === 'checkout.session.completed');
    
    if (event.type === 'checkout.session.completed') {
        try {
            customer = await stripe.customers.retrieve(data.customer)
            
        } catch (error) {
            console.log("customer retrieve error: ", error);
            return res.sendStatus(500)
        }

        interface ICustomer {
            metadata: {
                items: string,
                email: string,
            }
        }

        function isCustomerValid(customer: any): customer is ICustomer {
            const metadata = customer.metadata;

            return (
                metadata &&
                'items' in metadata &&
                'email' in metadata
            );
        }

        if (!isCustomerValid(customer)) return res.sendStatus(400) // to check if the customet object has required fields

        const items = JSON.parse(customer.metadata.items);

        const orderPayload: IOrder = {
            customer: customer.id,
            total: data.amount_total,
            currency: data.currency,
            payment: 'card',
            customerDetails: data.customer_details,
            items: items
        }

        try {
            await orderController.createOrder(orderPayload);
        } catch (error) {
            console.error('Error creating order:', error);
            return res.sendStatus(500);
        }
    }else {
        // console.log(event.type);
        return res.sendStatus(400)
    }


    return res.send({ customer, event })
})

export default {
    checkout,
    webhook
}