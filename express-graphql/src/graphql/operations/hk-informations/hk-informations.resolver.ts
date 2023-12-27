import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../context";
import { prisma } from "@/src/providers/database/prisma";

const housekeeperInformationResolver = {
  // ------------------------------------------------------------
  // TYPES
  // ------------------------------------------------------------
  HousekeeperInformation: {
    companyAddress: async (parent, args, ctx: GraphQLContext, info) => {
      const data = await prisma.housekeeperInformation.findFirst({
        select: {
          companyAddress: true,
        },
        where: {
          id: parent.id,
        },
      });

      return data?.companyAddress;
    },
  },

  // ------------------------------------------------------------
  // QUERIES
  // ------------------------------------------------------------
  Query: {
    housekeeperInformations: async (
      parent,
      args,
      ctx: GraphQLContext,
      info
    ) => {
      // pagination
      const { first, after } = args;

      if (!ctx.account) {
        throw new GraphQLError("Unauthorized");
      }

      const [data, count] =
        await prisma.housekeeperInformation.findManyAndCount({
          // pagination
          take: 20,
          skip: after ? 1 : 0, // skip the first item if after is defined
          cursor: after ? { id: Number(after) } : undefined,
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

export default housekeeperInformationResolver;
