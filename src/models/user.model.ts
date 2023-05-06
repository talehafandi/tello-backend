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
    lastLogin: string,
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
    // sex: { type: String, enum: ['m', 'f'] },
    role: { type: String, default: 'user' },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true },
    phone: {
        type: String,
        // unique: true
    },
    lastLogin:{
        type: String
    },    
    forgotPasswordCode: { type: String },
    oAuth: { type: Boolean, default: false }
})

export default mongoose.model('user', User);
