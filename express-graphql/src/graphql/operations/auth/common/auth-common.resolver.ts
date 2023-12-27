import { GraphQLContext } from "@/src/graphql/context";
import { GraphQLError } from "graphql";

const accountResolver = {
  Query: {
    me: async (parent, args, ctx: GraphQLContext, info) => {
      const { account } = ctx;

      if (!account) {
        throw new GraphQLError("Unauthorized");
      }

      if (account.role === "HOUSEKEEPER") {
        return {
          id: account.housekeeper.id,
          email: account.housekeeper.email,
          role: account.role,
        };
      } else if (account.role === "CUSTOMER") {
        return {
          id: account.customer.id,
          email: account.customer.email,
          role: account.role,
        };
      } else {
        throw new GraphQLError("Invalid role");
      }
    },
  },
};

export default accountResolver;
