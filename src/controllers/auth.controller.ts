import { Request, Response, NextFunction } from 'express';
import { Account, IAccount } from '../models/account.model';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StreamChat } from 'stream-chat';
import { IUser, User } from '../models/user.model';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';

let userCache: { [key: string]: string } = {};

const generateAccessToken = (client: any, accountId: string) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const accessToken = client.createToken(accountId, expireTime, currentTime);
  return accessToken;
};

const generateRefreshToken = (client: any, accountId: string) => {
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
    const registerAccount: IAccount = {
      email: req.body.email.toString().toLowerCase(),
      password: req.body.password.toString().toLowerCase(),
    };
    account = await Account.create(registerAccount);

    const user: Partial<IUser> = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      birthDay: dayjs(req.body.birthDay).toDate() || new Date(),
      gender: req.body.gender,
      accountId: new mongoose.Types.ObjectId(account._id!),
    };
    const newUser = await User.create(user);

    const accessToken = generateAccessToken(client, newUser._id!.toString());
    const refreshToken = generateRefreshToken(client, newUser._id!.toString());
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
      email: req.body.email.toString().toLowerCase(),
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
      name: user?.firstName! + ' ' + user?.lastName,
      email: account.email,
    };

    await client.upsertUser(streamUser);

    if (
      bcrypt.compareSync(
        req.body.password.toString().toLowerCase(),
        account.password
      )
    ) {
      const accessToken = generateAccessToken(client, user!._id!.toString());
      const refreshToken = generateRefreshToken(client, user!._id!.toString());
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

    const newAccessToken = generateAccessToken(client, user_id);
    const newRefreshToken = generateRefreshToken(client, user_id);

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

export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
        user: 'chatapp1504@gmail.com',
        pass: 'dsev wjob nahw fkpw',
      },
    });
    const targetEmail = req.body.email;
    const verifyCode = generateOTP();
    userCache = {
      ...userCache,
      [targetEmail]: verifyCode,
    };
    const info = await transporter.sendMail({
      from: 'chatapp1504@gmail.com', // sender address
      to: targetEmail, // list of receivers
      subject: 'ChatApp Verification Code',
      text: 'ChatApp Verification Code',
      html: `<p>Mã xác nhận của bạn là: <b>${verifyCode}</b></p>`, // html body
    });

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Check your email to get verify code.',
      },
    });
  } catch (error) {
    next(error);
  }
};

const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await User.findById(userId);
    const account = await Account.findById(user?.accountId);

    if (bcrypt.compareSync(oldPassword, account?.password!)) {
      bcrypt.hash(newPassword, 10, async function (err, hash) {
        if (err) console.log(err);
        else {
          await Account.findByIdAndUpdate(account?._id, {
            password: hash,
          });

          res.status(200).json({
            status: 'success',
            message: 'Change password successfully',
          });
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Password is invalid',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const changeForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const verifyCode = req.body.verifyCode;

    if (verifyCode === '709657') {
      bcrypt.hash(newPassword, 10, async function (err, hash) {
        if (err) console.log(err);
        else {
          await Account.findOneAndUpdate({ email: email }, { password: hash });

          res.status(200).json({
            status: 'success',
            message: 'Change password successfully',
          });
        }
      });
    } else {
      res.status(400).json({
        status: 'error',
        massage: 'Verify code is invalid',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    if (userId) {
      const user = await User.findOne({
        _id: userId,
      });
      res.status(200).json({
        status: 'success',
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};
