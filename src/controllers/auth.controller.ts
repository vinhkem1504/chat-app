import { Request, Response, NextFunction } from 'express';
import { Account, IAccount } from '../models/account.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const genarateAccessToken = (accountId: string) => {
  const accessToken = jwt.sign(
    { accountId: accountId },
    process.env.APP_SECRET!,
    {
      expiresIn: '60m',
    }
  );
  return accessToken;
};

const genarateRefreshToken = (accountId: string) => {
  const refreshToken = jwt.sign(
    { accountId: accountId },
    process.env.APP_SECRET!,
    {
      expiresIn: '7d',
    }
  );
  return refreshToken;
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await Account.create(req.body);
    const accessToken = genarateAccessToken(account._id);
    const refreshToken = genarateRefreshToken(account._id);
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
    const account: IAccount | null = await Account.findOne({
      username: req.body.username,
    });

    if (!account) {
      const err = new Error('Username not found');
      return next(err);
    }

    if (bcrypt.compareSync(req.body.password, account.password)) {
      const accessToken = genarateAccessToken(account._id!);
      const refreshToken = genarateRefreshToken(account._id!);
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
    console.log(refreshToken);

    const payload = jwt.verify(
      refreshToken,
      process.env.APP_SECRET!
    ) as JwtPayload;
    const { accountId } = payload;

    const newAccessToken = genarateAccessToken(accountId);
    const newRefreshToken = genarateRefreshToken(accountId);

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
