import { Request, Response, NextFunction } from 'express';

export interface IError {
  statusCode?: number;
  message?: string | string[];
  code?: number | string;
  keyValue?: any;
  errors?: any;
}

export const errorHandler = (
  error: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;

  //authentication
  if (error.code === 401) {
    error.statusCode = 401;
    error.message = 'Authenticated failed!';
  }

  //duplicate
  if (error.code === 11000) {
    error.statusCode = 400;
    for (let p in error.keyValue) {
      error.message = `${p} have to unique`;
    }
  }

  //not found
  if (error.code === 'ObjectId' || error.code === 404) {
    error.statusCode = 404;
    error.message = 'Not found!';
  }

  //validation
  if (error.errors) {
    error.statusCode = 400;
    error.message = [];
    for (let p in error.errors) {
      error.message.push(error.errors[p].properties.message);
    }
  }

  res.status(error.statusCode).json({
    status: 'ERROR',
    data: {
      statusCode: error.statusCode,
      message: error.message,
    },
  });
};
