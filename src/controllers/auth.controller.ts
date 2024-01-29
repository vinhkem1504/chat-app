import { Request, Response, NextFunction } from 'express';
import { Account, IAccount } from '../models/account.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StreamChat } from 'stream-chat';
import { IUser, User } from '../models/user.model';
import mongoose from 'mongoose';

const genarateAccessToken = (client: any, accountId: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const accessToken = client.createToken(accountId, expireTime, currentTime);
  return accessToken;
};

const genarateRefreshToken = (client: any, accountId: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const refreshToken = client.createToken(accountId, expireTime, currentTime);

  return refreshToken;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let account: IAccount | null = null;
  try {
    const client = StreamChat.getInstance(
      process.env.STREAM_APP_API_KEY!,
      process.env.APP_SECRET
    );
    account = await Account.create(req.body);
    const user: Partial<IUser> = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      birthDay: req.body.birthDay || new Date(),
      gender: req.body.gender,
      accountId: new mongoose.Types.ObjectId(account._id!),
    };
    const newUser = await User.create(user);

    console.log('user', newUser);

    const accessToken = genarateAccessToken(client, newUser._id!.toString());
    const refreshToken = genarateRefreshToken(client, newUser._id!.toString());
    res.status(200).json({
      status: 'success',
      data: newUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    if (account) {
      await Account.deleteOne({ _id: account._id });
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const client = StreamChat.getInstance(
      process.env.STREAM_APP_API_KEY!,
      process.env.APP_SECRET
    );

    const account: IAccount | null = await Account.findOne({
      username: req.body.username,
    });
    if (!account) {
      const err = new Error('Username not found');
      return next(err);
    }
    const user = await User.findOne({
      accountId: account?._id,
    });

    const streamUser = {
      id: user?._id!,
      name: user?.firstName!,
      email: account.email,
    };

    await client.upsertUser(streamUser);

    if (bcrypt.compareSync(req.body.password, account.password)) {
      const accessToken = genarateAccessToken(client, user!._id!.toString());
      const refreshToken = genarateRefreshToken(client, user!._id!.toString());
      res.status(200).json({
        status: 'success',
        data: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      const err = new Error('Password is not correct');
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.body.refreshToken;
    const client = StreamChat.getInstance(
      process.env.STREAM_APP_API_KEY!,
      process.env.APP_SECRET
    );

    const payload = jwt.verify(
      refreshToken,
      process.env.APP_SECRET!
    ) as JwtPayload;

    const { user_id } = payload;

    const newAccessToken = genarateAccessToken(client, user_id);
    const newRefreshToken = genarateRefreshToken(client, user_id);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfomation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const userUpdate = await User.findByIdAndUpdate(userId, req.body);

    res.status(200).json({
      status: 'success',
      data: userUpdate,
    });
  } catch (error) {
    next(error);
  }
};
