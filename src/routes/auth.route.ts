import express from 'express';
import { register, login } from '../controllers/auth.controller';

export const authRoute = express.Router();

authRoute.route('/register').post(register);
authRoute.route('/login').post(login);
