import dayjs from "dayjs";
import { Request, Response } from "express";
import passport from "passport";
import passportHTTPBearer from "passport-http-bearer";
import { prisma } from "../../../../providers/database/prisma";

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
const sessionsStrategy = async (
  req: Request,
  res: Response
): Promise<any | false> => {
  // Call passport authentication mechanism
  return await new Promise((resolve, reject) => {
    passport.authenticate("bearer", { session: false }, (err, user) => {
      // ----------------------------
      // Handle middleware error
      // ----------------------------
      if (err) {
        return reject();
      }

      // ----------------------------
      // Handle authentication failure
      // ----------------------------
      if (!user) {
        return reject();
      }

      // ----------------------------
      // Handle authentication success
      // ----------------------------
      return resolve(user);
    })(req, res);
  });
};

export { sessionsStrategy };
