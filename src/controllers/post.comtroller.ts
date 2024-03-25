import { NextFunction, Request, Response } from 'express';
import { IPost, Post } from '../models/post.model';
import { FriendShip } from '../models/friendship.model';
import { Album, IAlbum } from '../models/album.model';
import mongoose from 'mongoose';
import { IError } from '../middlewares/errorHandler';
import { ILike, Like } from '../models/like.model';
import { compare } from 'bcryptjs';
import { Comment, IComment } from '../models/comment.model';

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

export const like = async (req: Request, res: Response, next: NextFunction) => {
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

// export const getLikesByPost = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, postId } = req.body;
//     const likes = await Like.find({
//       userId,
//       targetId: postId,
//     });
//     res.status(200).json({
//       message: 'success',
//       data: likes,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const unLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, targetId } = req.body;
    const like = await Like.findOneAndDelete({
      userId,
      targetId: targetId,
    });
    res.status(200).json({
      message: 'delete success',
      like,
    });
  } catch (error) {
    next(error);
  }
};

export const comment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, content, postId, targetId, level } = req.body;

    const newComment = await Comment.create({
      content,
      userId,
      postId,
      targetId,
      level,
    });

    res.status(200).json({
      status: 'success',
      data: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    console.log({ postId });

    const comments = await Comment.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
          level: 1,
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'targetId',
          as: 'first_replies',
        },
      },
      {
        $unwind: '$first_replies', // Unwind the array before the next lookup
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'first_replies._id',
          foreignField: 'targetId',
          as: 'first_replies.second_replies',
        },
      },
      {
        $group: {
          _id: '$_id',
          content: { $first: '$content' },
          image: { $first: '$image' },
          userId: { $first: '$userId' },
          postId: { $first: '$postId' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          first_replies: { $push: '$first_replies' },
        },
      },
      {
        $sort: {
          createdAt: 1,
          'first_replies.createdAt': 1,
          'first_replies.second_replies.createdAt': 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, commentId, content } = req.body;

    const updateComment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        userId,
      },
      {
        content,
      },
      {
        returnDocument: 'after',
      }
    );

    res.status(200).json({
      status: 'success',
      data: updateComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.body;
    await Comment.find({
      targetId: commentId,
    }).then((replies) => {
      replies.map(async (replyItem) => {
        if (replyItem) {
          await Comment.deleteMany({
            _id: replyItem._id,
          });
        }
      });
    });

    await Comment.deleteMany({
      targetId: commentId,
    });

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      status: 'success',
      message: 'deleted',
    });
  } catch (error) {
    next(error);
  }
};
