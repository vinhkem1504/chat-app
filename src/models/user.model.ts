import mongoose, { Schema, Types } from 'mongoose';

export type TLocation = {
  lat: number;
  lng: number;
};

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  birthDay: Date;
  avatar: string;
  coverPhoto: string;
  bioInfo?: string;
  address: string;
  currentLocation?: TLocation;
  accountId: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    birthDay: {
      type: Date,
      required: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: 'default avatar link',
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: 'default cover photo link',
    },
    address: {
      type: String,
      trim: true,
    },
    currentLocation: {
      type: Object,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Account',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
