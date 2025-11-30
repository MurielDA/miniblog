import mongoose, { Document, Types } from 'mongoose';

export interface IPost extends Document {
    _id: Types.ObjectId;
    content: string;
    author: Types.ObjectId;
    likes: Types.ObjectId[];
    retweets: Types.ObjectId[];
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
    content: {
        type: String,
        required: true,
        maxlength: [280, "Post content cannot exceed 280 characters"],
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    images: [String]
    },
    { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

postSchema.set("toJSON", {
    transform: (document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

postSchema.set('toObject', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});



export const Post = mongoose.model<IPost>("Post", postSchema);