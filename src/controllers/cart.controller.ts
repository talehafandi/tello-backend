import Cart from '../models/cart.model';
import asyncMiddleware from '../middlewares/async.middleware'
// import Err from '../error/Err'
import { Req, Res, Next } from '../types/express'
import { ApiError } from '../error/ApiError';


const create = asyncMiddleware(async (req: Req, res: Res) => {
    const cart = await Cart.create(req.body)
    return res.status(201).json(cart)
})

const getOne = asyncMiddleware(async (req: Req, res: Res, next: Next) => {
    const cart = await Cart.findById(req.params.id)
    if (!cart) throw new ApiError('CART_NOT_FOUND', 404)

    return res.status(201).json(cart)
})

// increment, decrement, delete item in the cart
const updateItem = asyncMiddleware(async (req: Req, res: Res) => {
    const { cartId, itemId } = req.params
    const { qty } = req.body

    const cart = await Cart.findById(cartId)
    if (!cart) throw new ApiError('CART_NOT_FOUND', 404)

    // delete item if qty is 0
    if (qty === 0) {
        const deleteQuery = {
            $pull: {
                products: { product: itemId }, 
                variants: { variant: itemId } 
            }
        }
        const cart = await Cart.findByIdAndUpdate(cartId, deleteQuery, { new: true })
        
        return res.status(200).json(cart)
    }

    // Combine the products and variants arrays into a single array to simplify the search for the item to update
    const items = [...cart.products, ...cart.variants];

    const item = items.find((el: any) => {
        return el.product?._id.toString() === itemId || el.variant?._id.toString() === itemId
    });
    if (!item) throw new ApiError('ITEM_NOT_FOUND', 404)

    item.qty = qty
    await cart.save()

    return res.status(200).json(cart)
})

const deleteCart = asyncMiddleware(async (req: Req, res: Res) => {
    const { id } = req.params

    const cart = await Cart.findByIdAndRemove(id)
    if (!cart) throw new ApiError('CART_NOT_FOUND', 404)

    return res.status(200).json(cart)
})

export default {
    create,
    getOne,
    updateItem,
    deleteCart
}

