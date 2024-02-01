import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export const updateUserInfomation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const userUpdate = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: userUpdate,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInfomation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const userInfo = await User.findById(userId);

    res.status(200).json({
      status: 'success',
      data: userInfo,
    });
  } catch (error) {
    next(error);
  }
};
