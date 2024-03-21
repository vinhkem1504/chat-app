import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { FriendShip, IFriendShip } from '../models/friendship.model';
import mongoose from 'mongoose';
import { IError } from '../middlewares/errorHandler';

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

export const sendRequestFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    const checkFriendShip = await FriendShip.findOne({
      userId: userId,
      friendId: friendId,
    }).then((data) => {
      if (data) {
        return FriendShip.findByIdAndUpdate(
          data._id,
          {
            status: 1,
            isFollow: true,
          },
          { returnDocument: 'after' }
        );
      } else {
        const newFriendShip: IFriendShip = {
          userId: new mongoose.Types.ObjectId(userId),
          friendId: new mongoose.Types.ObjectId(friendId),
          isFollow: true,
          status: 1,
        };
        const data = FriendShip.create(newFriendShip);
        return data;
      }
    });
    res.status(200).json({
      status: 'success',
      data: checkFriendShip,
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const isFollow = req.body.isFollow;
    let check = true;
    const checkFriendShip = await FriendShip.find({
      $or: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    checkFriendShip.map((friendItem) => {
      if (friendItem.status === -1) {
        check = false;
        return;
      }
    });

    if (check) {
      const data = await FriendShip.findOne({
        userId,
        friendId,
      }).then((data) => {
        if (data) {
          return FriendShip.findOneAndUpdate(
            {
              _id: data._id,
            },
            {
              isFollow: isFollow,
            },
            {
              returnDocument: 'after',
            }
          );
        } else {
          const newFriendShip = FriendShip.create({
            userId,
            friendId,
            isFollow: isFollow,
          });
          return newFriendShip;
        }
      });

      res.status(200).json({
        status: 'success',
        data: data,
      });
    } else {
      res.status(200).json({
        status: 'error',
        message: 'Block!',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const responseFriendRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const status = req.body.status;
    const isFollow = status === 2;

    const friendRequest = await FriendShip.find({
      userId: friendId,
      friendId: userId,
    }).then((data) => {
      if (data) {
        const res = FriendShip.updateMany(
          {
            $or: [
              { userId, friendId },
              { userId: friendId, friendId: userId },
            ],
          },
          { $set: { status: status, isFollow: isFollow } }
        );

        if (res.elemMatch.length < 2) {
          FriendShip.create({
            userId,
            friendId,
            isFollow: true,
            status,
          });
        }

        return FriendShip.updateMany(
          {
            $or: [
              { userId, friendId },
              { userId: friendId, friendId: userId },
            ],
          },
          { $set: { status: status, isFollow: isFollow } }
        );
      } else {
        return null;
      }
    });

    if (friendId) {
      res.status(200).json({
        status: 'success',
        data: friendRequest,
      });
    } else {
      const err: IError = {
        code: 404,
        message: 'Not founded',
      };
    }
  } catch (error) {
    next(error);
  }
};

export const getFriendRequestList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const friendRequestList = await FriendShip.find({
      friendId: userId,
      status: 1,
    });

    res.status(200).json({
      status: 'success',
      data: friendRequestList,
    });
  } catch (error) {
    next(error);
  }
};
