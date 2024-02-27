import { NextFunction, Request, Response } from 'express';
import { IPost, Post } from '../models/post.model';

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
    const post = Post.findById(postId);
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
