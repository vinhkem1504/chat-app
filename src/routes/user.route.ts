import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import {
  followUser,
  getFriendRequestList,
  getUserInfomation,
  responseFriendRequest,
  sendRequestFriend,
  updateUserInfomation,
} from '../controllers/user.controller';
import { changePassword } from '../controllers/auth.controller';

export const userRoute = express.Router();

userRoute.route('/').get(verifyToken, getUserInfomation);
userRoute.route('/update').post(verifyToken, updateUserInfomation);
userRoute.route('/change-password').post(verifyToken, changePassword);
userRoute.route('/update').post(verifyToken, updateUserInfomation);
userRoute.route('/friend/add-friend').post(verifyToken, sendRequestFriend);
userRoute.route('/friend/follow').post(verifyToken, followUser);
userRoute
  .route('/friend/response-request')
  .post(verifyToken, responseFriendRequest);
userRoute.route('/friend/list-request').get(verifyToken, getFriendRequestList);
