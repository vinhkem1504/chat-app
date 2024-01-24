import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';

export interface INotification {
  _id?: string;
  content: string;
  isRead: boolean;
  receiverId: Types.ObjectId;
}

const notificationSchema = new Schema<INotification>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: User.name,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
