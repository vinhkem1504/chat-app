import mongoose, { Schema } from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcryptjs';
export interface IAccount {
  _id?: string;
  email: string;
  password: string;
}

const accountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: [isEmail, 'Email is invalid'],
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [6, 'Password must be at 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.pre('save', function (next) {
  let user = this;
  if (user.password)
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) return next;
      else {
        user.password = hash;
        next();
      }
    });
});

export const Account = mongoose.model<IAccount>('Account', accountSchema);
