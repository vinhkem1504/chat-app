import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import {
  comment,
  creatPost,
  createAlbum,
  deleteComment,
  getCommentByPost,
  getFriendPosts,
  getMyPosts,
  getPostById,
  like,
  unLike,
  updateComment,
  updatePost,
} from '../controllers/post.comtroller';

export const postRoute = express.Router();

postRoute.route('/create').post(verifyToken, creatPost);
postRoute.route('/update').post(verifyToken, updatePost);
postRoute.route('/friendPosts').get(verifyToken, getFriendPosts);
postRoute.route('/myPosts').get(verifyToken, getMyPosts);
postRoute.route('/detail/:postId').get(verifyToken, getPostById);
postRoute.route('/create/album').post(verifyToken, createAlbum);
postRoute.route('/like').post(verifyToken, like);
postRoute.route('/unLike').post(verifyToken, unLike);
postRoute.route('/like/:postId').post(verifyToken, unLike);
postRoute.route('/comment/:postId').get(verifyToken, getCommentByPost);
postRoute.route('/comment/create').post(verifyToken, comment);
postRoute.route('/comment/update').post(verifyToken, updateComment);
postRoute.route('/comment/delete').post(verifyToken, deleteComment);
