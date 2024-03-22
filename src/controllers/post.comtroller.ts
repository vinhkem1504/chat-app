import { NextFunction, Request, Response } from 'express';
import { IPost, Post } from '../models/post.model';
import { FriendShip } from '../models/friendship.model';
import { Album, IAlbum } from '../models/album.model';
import mongoose from 'mongoose';
import { IError } from '../middlewares/errorHandler';
import { ILike, Like } from '../models/like.model';
import { compare } from 'bcryptjs';

export const creatPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost: Partial<IPost> = {
      userId: req.body.userId,
      content: req.body.content,
      images: req.body.images,
      albumId: req.body.albumId,
    };

    const post = await Post.create(newPost);

    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId).then(async (post) => {
      const likes = await Like.find({
        userId,
        targetId: post?._id,
      }).select(['type']);

      return { post, likes, likeNumber: likes.length };
    });

    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getFriendPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const listFriend = await FriendShip.find({
      userId,
      isFollow: true,
    });
    const listFriendId = listFriend.map((friendItem) => friendItem.friendId);

    const listPost = await Post.find({
      userId: {
        $in: listFriendId,
      },
      isDelete: false,
    }).then(async (posts) => {
      return await Promise.all(
        posts.map(async (post) => {
          const likes = await Like.find({
            userId,
            targetId: post._id,
          }).select(['type']);

          return { post, likes, likeNumber: likes.length };
        })
      );
    });

    res.status(200).json({
      status: 'success',
      data: listPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;

    const listPost = await Post.find({
      userId,
      isDelete: false,
    }).then(async (posts) => {
      return await Promise.all(
        posts.map(async (post) => {
          const likes = await Like.find({
            userId,
            targetId: post._id,
          }).select(['type']);

          return { post, likes, likeNumber: likes.length };
        })
      );
    });

    res.status(200).json({
      status: 'success',
      data: listPost,
    });
  } catch (error) {
    next(error);
  }
};

export const createAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const newAlbum: Partial<IAlbum> = {
      userId: new mongoose.Types.ObjectId(userId),
      albumName: req.body.albumName,
      albumDescription: req.body.albumDescription,
    };

    const album = await Album.create(newAlbum);

    res.status(200).json({
      status: 'success',
      data: album,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, postId, content, isDelete } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        userId,
      },
      {
        content,
        isDelete,
      }
    );
    if (post) {
      res.status(200).json({
        status: 'success',
        data: post,
      });
    } else {
      const err: IError = {
        code: 404,
      };
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, targetId } = req.body;
    const newLike: Partial<ILike> = {
      type: req.body.type,
      userId: new mongoose.Types.ObjectId(userId),
      targetId: new mongoose.Types.ObjectId(targetId),
    };

    const like = await Like.create(newLike);
    res.status(200).json({
      message: 'success',
      data: like,
    });
  } catch (error) {
    next(error);
  }
};

export const getLikesByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, postId } = req.body;
    const likes = await Like.find({
      userId,
      targetId: postId,
    });
    res.status(200).json({
      message: 'success',
      data: likes,
    });
  } catch (error) {
    next(error);
  }
};

export const unLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, postId } = req.body;
    const like = await Like.findOneAndDelete({
      userId,
      targetId: postId,
    });
    res.status(200).json({
      message: 'delete success',
    });
  } catch (error) {
    next(error);
  }
};
