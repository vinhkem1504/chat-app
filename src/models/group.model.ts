import mongoose, { Schema } from 'mongoose';
import { User } from './user.model';

export interface IGroup {
  groupName: string;
  groupAdmin?: mongoose.Types.ObjectId[];
  groupMember?: mongoose.Types.ObjectId[];
}

const groupSchema = new Schema<IGroup>(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupAdmin: {
      type: [mongoose.Types.ObjectId],
      ref: User.name,
      default: [],
    },
    groupMember: {
      type: [mongoose.Types.ObjectId],
      ref: User.name,
    },
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
