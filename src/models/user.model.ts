import mongoose, { Schema, Types } from 'mongoose';
import { Account } from './account.model';

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
  phoneNumber: string;
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
      default: '',
    },
    coverPhoto: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    bioInfo: {
      type: String,
      trim: true,
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
      ref: Account.name,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
