import mongoose, { Schema, Types } from 'mongoose';

export interface IAlbum {
  _id?: string;
  userId: Types.ObjectId;
  albumName: string;
  albumDescription: string;
}

const albumSchema = new Schema<IAlbum>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    albumName: {
      type: String,
      required: true,
      trim: true,
    },
    albumDescription: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Album = mongoose.model('Album', albumSchema);
