import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';
import { Group } from './group.model';
import { Reaction } from './reaction.model';

export interface IMessage {
  _id?: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  userSeenId?: Types.ObjectId[];
  reactionId?: Types.ObjectId;
  content?: string;
  images?: string[];
}

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    userSeenId: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    reactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Reaction',
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
