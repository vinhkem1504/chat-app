import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';
import { Post } from './post.model';

export interface IComment {
  _id?: string;
  content: string;
  image: string;
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  targetId: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User.name,
    },
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: Post.name,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);
