import mongoose, { Schema } from 'mongoose';

export interface IFriendShip {
  status: number;
  isFollow: boolean;
  userId?: mongoose.Types.ObjectId;
  friendId?: mongoose.Types.ObjectId;
}

//block: -1
//block: -1
//request: 1
//friend: 2

const friendShipSchema = new Schema<IFriendShip>(
  {
    status: {
      type: Number,
      required: true,
      default: 1,
    },
    isFollow: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    friendId: {
      type: mongoose.Types.ObjectId,
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
