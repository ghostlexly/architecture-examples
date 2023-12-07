import { User } from "@prisma/client";
import createHttpError from "http-errors";

const rolesGuard = (roles: string[]) => (req, res, next) => {
  const user: User = req.user;

  if (!roles.includes(user.role)) {
    return next(
      createHttpError.Forbidden("You are not allowed to access this resource.")
    );
  }

  return next();
};

export { rolesGuard };
