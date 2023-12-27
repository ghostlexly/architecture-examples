import { GraphQLContext } from "@/src/graphql/context";
import { prisma } from "@/src/providers/database/prisma";
import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dayjs from "dayjs";

const AuthHousekeeperResolver = {
  Mutation: {
    authHousekeeper: async (parent, args, ctx: GraphQLContext, info) => {
      const { email, password } = args.input;

      // ------------------
      // check if user exists
      // ------------------
      const user = await prisma.housekeeper.findFirst({
        include: {
          account: true,
        },
        where: { email: email },
      });

      if (!user) {
        throw new GraphQLError(
          "Les identifiants que vous avez saisis sont invalides.",
          {
            extensions: {
              code: "INVALID_CREDENTIALS",
            },
          }
        );
      }

      // ------------------
      // hash given password and compare it to the stored hash
      // ------------------
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new GraphQLError(
          "Les identifiants que vous avez saisis sont invalides.",
          {
            extensions: {
              code: "INVALID_CREDENTIALS",
            },
          }
        );
      }

      // ------------------
      // generate session token
      // ------------------
      const session = await prisma.session.create({
        data: {
          expiresAt: dayjs.utc().add(7, "day").toDate(),
          sessionToken: crypto.randomUUID(),
          accountId: user.accountId,
        },
      });

      return { access_token: session.sessionToken };
    },
  },
};

export default AuthHousekeeperResolver;
