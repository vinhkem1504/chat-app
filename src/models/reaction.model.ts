import mongoose, { Schema, Types } from 'mongoose';

export interface IReaction {
  _id?: string;
  image: string;
}

const reactSchema = new Schema<IReaction>(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Reaction = mongoose.model('Reaction', reactSchema);
