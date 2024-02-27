import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';
import { Album } from './album.model';

export interface IPost {
  _id?: string;
  content: string;
  images: string[];
  userId: Types.ObjectId;
  albumId?: Types.ObjectId;
}

const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      trim: true,
      require: true,
    },
    images: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
