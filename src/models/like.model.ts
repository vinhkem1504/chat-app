import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';
import { Post } from './post.model';
import { Comment } from './comment.model';

export interface ILike {
  _id?: string;
  userId: Types.ObjectId;
  targetId?: Types.ObjectId;
  type: number;
}

//like: 0
//love: 1
//haha: 2
//huhu: 3
//angry: 4

const likeSchema = new Schema<ILike>(
  {
    type: {
      type: Number,
      required: true,
      default: 1,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    targetId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model('Like', likeSchema);
