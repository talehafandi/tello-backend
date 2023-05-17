import mongoose from 'mongoose';
const Schema = mongoose.Schema
import { Document } from "mongoose";

export interface IUser extends Document{
    _id: mongoose.Types.ObjectId,
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: string;
    oAuth: boolean;
    phone?: string,
    forgotPasswordCode?: number | null,
    address?: {
        country?: string | undefined;
        city?: string | undefined;
        street?: string | undefined;
        zipCode?: string | undefined;
    } 
}

const User = new Schema<IUser>({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    address: {
        country: { type: String },
        city: { type: String },
        street: { type: String },
        zipCode: { type: String }
    },
    role: { type: String, default: 'user' },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true, select: false },
    phone: {
        type: String,
    },   
    forgotPasswordCode: { type: String },
    oAuth: { type: Boolean, default: false, select: false }
})

// ! Add middleware to diselect password field in find querry

export default mongoose.model<IUser>('user', User);
