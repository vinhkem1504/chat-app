import mongoose, { Schema } from 'mongoose';
import { User } from './user.model';
import { Group } from './group.model';

export interface IMessage {
  senderId?: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  userSeenId?: mongoose.Types.ObjectId[];
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
      type: mongoose.Types.ObjectId,
      ref: User.name,
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: Group.name,
      required: true,
    },
    userSeenId: {
      type: [mongoose.Types.ObjectId],
      ref: User.name,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
