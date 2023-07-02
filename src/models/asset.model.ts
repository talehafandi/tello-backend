import { model, Schema } from "mongoose";

interface  IAsset {
    filename: string,
    url: string,
    public_id: string
}

const Asset = new Schema<IAsset>({
    filename: String,
    url: String,
    public_id: {
        type: String,
        select: false
    }
})

export default model<IAsset>('asset', Asset)