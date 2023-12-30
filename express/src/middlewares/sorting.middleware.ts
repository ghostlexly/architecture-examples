import { NextFunction, Request, Response } from "express";

/**
  Handle OrderBy sorting from query params.
  @example /api/users?orderBy=createdAt:desc
*/
const sortingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { orderBy } = req.query;

  // If no orderBy query param provided, skip this middleware
  if (!orderBy) return next();

  // Split orderBy query param into column and direction
  const [column, direction] = orderBy.toString().split(":");

  // --------------------
  // Nested sorting
  // --------------------
  if (column.includes(".")) {
    const relationalColumns = column.split(".");

    req.meta = {
      sorting: {
        include: {
          [relationalColumns[0]]: {
            orderBy: {
              [relationalColumns[1]]: direction.toLowerCase() as "asc" | "desc",
            },
          },
        },
      },

      ...req.meta,
    };

    return next();
  }

  // --------------------
  // Simple sorting
  // --------------------
  req.meta = {
    sorting: {
      orderBy: {
        [column]: direction.toLowerCase() as "asc" | "desc",
      },
    },

    ...req.meta,
  };

  return next();
};

export default sortingMiddleware;
