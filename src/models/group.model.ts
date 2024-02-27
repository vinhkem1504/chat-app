import mongoose, { Schema, Types } from 'mongoose';
import { User } from './user.model';

export interface IGroup {
  _id?: string;
  groupName: string;
  groupAdmin: Types.ObjectId[];
  groupMember: Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupAdmin: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    groupMember: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
