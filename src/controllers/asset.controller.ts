import { ApiError } from './../error/ApiError';
import Asset from "../models/asset.model";
import { Req, Res } from "../types/express";
import asyncMiddleware from "../middlewares/async.middleware";
import cloudinary from "../utils/cloudinary";

//? one asset can be referenced to multiple items
const upload = asyncMiddleware(async (req: Req, res: Res) => {
    const file = req.file as Express.Multer.File
    const result = await cloudinary.upload(file)
    if (!result) throw new ApiError('ASSET_COULD_NOT_ADDED', 500)

    const asset = await Asset.create({
        filename: file.filename,
        url: result.url,
        public_id: result.public_id
    })

    console.log(asset);
    
    return res.status(200).json({ asset })
})

//? when asset is deleted, ref is not removed from 'product', 'variant' etc
const remove = asyncMiddleware(async (req: Req, res: Res) => {
    const id = req.params.id

    const asset = await Asset.findById(id).select('+public_id')
    if (!asset) throw new ApiError('ASSET_NOT_FOUND', 404)

    const result = await cloudinary.destroy(asset.public_id)
    if (!result) throw new ApiError('ASSET_COULD_NOT_DELETED', 500)

    await Asset.findByIdAndRemove(id)
    return res.status(200).json({ message: 'The File is Deleted, Your Majesty.' })
})

export default {
    upload,
    remove
}