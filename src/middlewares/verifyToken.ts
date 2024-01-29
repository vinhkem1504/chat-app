import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StreamChat } from 'stream-chat';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header('authorization');
  const token = authorization?.replace('Bearer ', '');
  console.log('tokern', token);

  if (!token || String(token) === 'null') {
    const err = new Error('Unauthorization');
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
