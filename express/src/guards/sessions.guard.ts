import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import passport from "passport";
import passportHTTPBearer from "passport-http-bearer";
import { prisma } from "../providers/database/prisma";
import dayjs from "dayjs";

const whiteListUrls = [
  { method: "POST", url: "/api/auth/housekeeper/login" },
  { method: "POST", url: "/api/housekeepers/register" },
  { method: "POST", url: "/api/auth/customer/login" },
  { method: "POST", url: "/api/customers/register" },
];

passport.use(
  "bearer",
  new passportHTTPBearer.Strategy(async (token, done) => {
    try {
      // ----------------------------
      // Search token in database
      // ----------------------------
      const session = await prisma.session.findUnique({
        include: {
          account: {
            include: {
              housekeeper: true,
              customer: true,
            },
          },
        },
        where: {
          sessionToken: token,
        },
      });

      if (!session) {
        return done(null, false);
      }

      // ----------------------------
      // Check if token is expired
      // ----------------------------
      if (dayjs.utc().isAfter(session.expiresAt)) {
        await prisma.session.delete({
          where: {
            id: session.id,
          },
        });

        return done(null, false);
      }

      // ----------------------------
      // Return user
      // ----------------------------
      return done(null, session.account, { scope: "all" });
    } catch (err) {
      return done(null, false);
    }
  })
);

/**
  Block everything if the user is not authenticated and the route is not public
  get the user from the token and add it to the request.
  @example app.get('/', (req) => req.account)
*/
const sessionsGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Call passport authentication mechanism
  await passport.authenticate("bearer", { session: false }, (err, user) => {
    // ----------------------------
    // Handle middleware error
    // ----------------------------
    if (err) {
      return next(err);
    }

    // ----------------------------
    // Handle authentication failure
    // ----------------------------
    if (!user) {
      // Check if url is in white list
      if (
        whiteListUrls.filter((v) => {
          return v.method === req.method && req.url.match(v.url);
        }).length >= 1
      ) {
        return next();
      }

      return next(createHttpError.Forbidden("Unauthorized"));
    }

    // ----------------------------
    // Handle authentication success
    // ----------------------------
    req.account = user;
    next();
  })(req, res, next);
};

export { sessionsGuard };
