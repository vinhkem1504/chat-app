import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import {
  creatPost,
  createAlbum,
  getFriendPosts,
  getMyPosts,
  getPostById,
  likePost,
  updatePost,
} from '../controllers/post.comtroller';

export const postRoute = express.Router();

postRoute.route('/create').post(verifyToken, creatPost);
postRoute.route('/update').post(verifyToken, updatePost);
postRoute.route('/friendPosts').get(verifyToken, getFriendPosts);
postRoute.route('/myPosts').get(verifyToken, getMyPosts);
postRoute.route('/detail/:postId').get(verifyToken, getPostById);
postRoute.route('/create/album').post(verifyToken, createAlbum);
postRoute.route('/like').post(verifyToken, likePost);
