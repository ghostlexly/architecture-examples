import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import passport from "passport";
import passportHTTPBearer from "passport-http-bearer";
import jwt, { Secret } from "jsonwebtoken";
import { prisma } from "../providers/database/prisma";

const whiteListUrls = ["/api/auth/login", "/api/auth/register"];

passport.use(
  new passportHTTPBearer.Strategy(async (token, done) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as Secret);
      const user = await prisma.user.findFirst({
        where: { id: payload.sub as unknown as string },
      });

      if (!user) {
        return done(null, false);
      }

      return done(null, user, { scope: "all" });
    } catch (err) {
      return done(null, false);
    }
  })
);

const JwtGuard = async (req: Request, res: Response, next: NextFunction) => {
  // -- Call passport authentication mechanism
  await passport.authenticate("bearer", { session: false }, (err, user) => {
    // -- Handle middleware error
    if (err) {
      return next(err);
    }

    // -- Handle authentication failure
    if (!user) {
      if (whiteListUrls.includes(req.path)) {
        return next();
      }

      return next(createHttpError.Forbidden("Unauthorized"));
    }

    // -- Handle authentication success
    req.user = user;
    next();
  })(req, res, next);
};

export { JwtGuard };
