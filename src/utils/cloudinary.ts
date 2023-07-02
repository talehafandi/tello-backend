import { ApiError } from './../error/ApiError';
import { v2 as cloudinary } from "cloudinary"
import config from '../config'
import { unlink } from 'node:fs';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
  secure: true,
});

export interface uploadSuccess {
  url: string,
  public_id: string
}

export interface uploadFail {
  error: {
    message: string
  }
}

//TODO: Code is ugly, needs refactoring

const upload = async (payload: Express.Multer.File) => {
  try {    
    const result = await cloudinary.uploader.upload(payload.path)
    if(result.error) throw new ApiError('Something went wrong', 500)

    clearLocal(payload.path)

    const asset = {
      url: result.url,
      public_id: result.public_id
    }

    return asset
  } catch (error) {
    console.log("cloudinary error: ", error)
    throw new ApiError('ERROR', 500)
  }
}

// to delete images from local after uploading them to cloud
const clearLocal = (path: string) => {
  unlink(path, (err) => {
    if (err) {
      console.log("UNLINK ERROR: ", err)
      throw new ApiError('Something went wrong', 500)
    };
  })
}

const destroy = async (id: string) => {
  try {
    const response = await cloudinary.uploader.destroy(id)
  
    if (response.result !== 'ok') throw new ApiError('ASSET_CANNOT_BE_DELETED', 500)
  
    return true
  } catch (error) {
    console.log("cloudinary error: ", error)
    throw new ApiError('ERROR', 500)
  }
}

export default {
  upload,
  destroy
}