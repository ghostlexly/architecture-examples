import { NextFunction, Request, Response } from "express";

/**
  Handle pagination
  @example /api/users?limit=10&page=1
*/
const paginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { page, limit }: { page?: number; limit?: number } = req.query;

  let skip: number = 0;
  let take: number = 25;

  // define limit
  if (!limit || limit > 1000) {
    limit = 25;
  }

  // define page
  if (!page || page < 1) {
    page = 1;
  }

  // calculate skip and take
  skip = (+page - 1) * +limit;
  take = +limit;

  // add pagination to request meta
  req.meta = {
    pagination: {
      skip,
      take,
    },

    ...req.meta,
  };

  return next();
};

export default paginationMiddleware;
