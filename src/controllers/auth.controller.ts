import { Request, Response, NextFunction } from 'express';
import { Account, IAccount } from '../models/account.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const account = await Account.create(req.body);
    const accessToken = jwt.sign(
      { accountId: account._id },
      process.env.APP_SECRET!,
      { expiresIn: '60m' }
    );
    const refreshToken = jwt.sign(
      { accountId: account._id },
      process.env.APP_SECRET!,
      { expiresIn: '7d' }
    );
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
      const accessToken = jwt.sign(
        { accountId: account._id },
        process.env.APP_SECRET!,
        { expiresIn: '60m' }
      );
      const refreshToken = jwt.sign(
        { accountId: account._id },
        process.env.APP_SECRET!,
        { expiresIn: '7d' }
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
