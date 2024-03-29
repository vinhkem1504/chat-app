import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';

export interface IFriendShip {
  _id?: string;
  status?: number;
  isFollow: boolean;
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
}

//block: -1
//normal: 0
//request: 1
//friend: 2

const friendShipSchema = new Schema<IFriendShip>(
  {
    status: {
      type: Number,
      required: true,
      default: 0,
    },
    isFollow: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    friendId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const FriendShip = mongoose.model<IFriendShip>(
  'FriendShip',
  friendShipSchema
);
