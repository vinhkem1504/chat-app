import mongoose, { Schema, Types } from 'mongoose';

export interface IAlbum {
  _id?: string;
  albumName: string;
  albumDescription: string;
}

const albumSchema = new Schema<IAlbum>(
  {
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
