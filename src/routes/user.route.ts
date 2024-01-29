import express from 'express';
import { updateUserInfomation } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/verifyToken';

export const userRoute = express.Router();

userRoute.route('/update').post(verifyToken, updateUserInfomation);
