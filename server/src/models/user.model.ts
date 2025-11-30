import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
     _id: Types.ObjectId;
     username: string;
     email: string; 
     password: string;
     bio?: string;
     avatarUrl?: string;
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
        },
        bio: {
            type: String,
            maxlength: [160, "Bio cannot exceed 160 characters"]
        },
        avatarUrl: {
            type: String
        }
     },
     {timestamps: true}
);

userSchema.set('toJSON', {
  transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

userSchema.set('toObject', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export const User = mongoose.model<IUser>("User",userSchema);