import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header('authorization');
  const token = authorization?.replace('Bear ', '');

  if (!token || String(token) === 'null') {
    const err = new Error('Unauthorization');
    return next(err);
  }

  try {
    const payload = jwt.verify(token, process.env.APP_SECRET!) as JwtPayload;
    const { accountId } = payload;
    req.body.accountId = accountId;
    next();
  } catch (error) {
    next(error);
  }
};
