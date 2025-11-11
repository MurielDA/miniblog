import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser {
     username: string;
     email: string; 
     password: string;
     createdAt: Date;
     updatedAt: Date;
}

const userSchema = new Schema<IUser>(
     {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [30, "Username cannot exceed 30 characters"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: [8, "Password must be at least 8 characters long"],
            select: false
        }
     },
     {timestamps: true}
);

export const User = mongoose.model<IUser>("User",userSchema);