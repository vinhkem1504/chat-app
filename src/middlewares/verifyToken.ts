import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IError, errorHandler } from './errorHandler';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header('authorization');
  const token = authorization?.replace('Bearer ', '');

  if (!token || String(token) === 'null') {
    const err: IError = {
      code: 401,
    };
    return next(err);
  }

  try {
    const payload = jwt.verify(token, process.env.APP_SECRET!) as JwtPayload;
    // const payload = await client.token
    const { user_id } = payload;
    req.body.userId = user_id;
    next();
  } catch (error) {
    next(error);
  }
};
