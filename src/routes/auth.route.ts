import express from 'express';
import {
  register,
  login,
  refreshToken,
  sendMail,
  changeForgotPassword,
} from '../controllers/auth.controller';

export const authRoute = express.Router();

authRoute.route('/register').post(register);
authRoute.route('/login').post(login);
authRoute.route('/refresh').post(refreshToken);
authRoute.route('/sendmail').post(sendMail);
authRoute.route('/change-forgot-password').post(changeForgotPassword);
