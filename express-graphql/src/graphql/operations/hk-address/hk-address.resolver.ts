import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../context";
import { prisma } from "@/src/providers/database/prisma";

const housekeeperAddressResolver = {
  // ------------------------------------------------------------
  // TYPES
  // ------------------------------------------------------------
  HousekeeperAddress: {
    informations: async (parent, args, ctx: GraphQLContext, info) => {
      return prisma.housekeeperAddress
        .findFirst({
          where: {
            id: parent.id,
          },
        })
        .informations();
    },
  },

  // ------------------------------------------------------------
  // QUERIES
  // ------------------------------------------------------------
  Query: {
    housekeeperAddresses: async (parent, args, ctx: GraphQLContext, info) => {
      // pagination
      const { first, after } = args;

      if (!ctx.account) {
        throw new GraphQLError("Unauthorized");
      }

      const nodes = await prisma.housekeeperAddress.findMany({
        // pagination
        take: first && first > 100 ? 100 : first || 20,
        skip: after ? 1 : 0, // skip the first item if after is defined
        cursor: after ? { id: after } : undefined,
      });

      return {
        nodes: nodes,

        pageInfo: {
          nextPageCursor: nodes[nodes.length - 1]?.id,
        },
      };
    },
  },
};

export default housekeeperAddressResolver;
