import { Request, Response, NextFunction } from 'express';
import { Account, IAccount } from '../models/account.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StreamChat } from 'stream-chat';

const genarateAccessToken = (client: any, accountId: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = Math.floor(Date.now() / 1000) + 60 * 60;
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
  try {
    const client = StreamChat.getInstance(
      process.env.STREAM_APP_API_KEY!,
      process.env.APP_SECRET
    );
    const account: IAccount = await Account.create(req.body);
    const accessToken = genarateAccessToken(client, account._id!.toString());
    const refreshToken = genarateRefreshToken(client, account._id!.toString());
    res.status(200).json({
      status: 'success',
      data: account,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
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
    const user = {
      id: account._id!,
      email: account.email,
    };

    await client.upsertUser(user);

    if (bcrypt.compareSync(req.body.password, account.password)) {
      const accessToken = genarateAccessToken(client, account._id!.toString());
      const refreshToken = genarateRefreshToken(
        client,
        account._id!.toString()
      );
      res.status(200).json({
        status: 'success',
        data: account,
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

export const createUserInfomation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};
