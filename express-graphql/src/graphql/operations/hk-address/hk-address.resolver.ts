import { prisma } from "@/src/providers/database/prisma";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../context";

const housekeeperAddressResolver = {
  // ------------------------------------------------------------
  // TYPES
  // ------------------------------------------------------------
  HousekeeperAddress: {
    informations: async (parent, args, ctx: GraphQLContext, info) => {
      const data = await prisma.housekeeperAddress.findFirst({
        select: {
          informations: true,
        },
        where: {
          id: parent.id,
        },
      });

      return data?.informations;
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

      const [data, count] = await prisma.housekeeperAddress.findManyAndCount({
        // pagination
        take: 4,
        skip: after ? 1 : 0, // skip the first item if after is defined
        cursor: after ? { id: after } : undefined,
      });

      const edges = data.map((item) => {
        return {
          cursor: item.id,
          node: item,
        };
      });

      return {
        edges: edges,

        pageInfo: {
          startCursor: edges[0]?.cursor,
          endCursor: edges[edges.length - 1]?.cursor,
          totalCount: count,
        },
      };
    },
  },
};

export default housekeeperAddressResolver;
