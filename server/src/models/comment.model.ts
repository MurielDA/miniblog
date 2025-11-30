import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        content:{
            type: String,
            required: [true, "Comment content is required"],
            trim: true,
            maxlength: [280, "Comment must not exceed 280 characters"]
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true
        },
        post: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Post",
            index: true
        },
    },
    {
        timestamps:true,
    }
);

commentSchema.set('toJSON', {
  transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

commentSchema.set('toObject', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);