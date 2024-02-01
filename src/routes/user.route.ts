import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import {
  getUserInfomation,
  updateUserInfomation,
} from '../controllers/user.controller';

export const userRoute = express.Router();

userRoute.route('/').get(verifyToken, getUserInfomation);
userRoute.route('/update').post(verifyToken, updateUserInfomation);
