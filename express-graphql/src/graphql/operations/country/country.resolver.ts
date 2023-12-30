import { GraphQLContext } from "../../context";
import { prisma } from "@/src/providers/database/prisma";

const countryResolver = {
  Query: {
    countries: async (parent, args, ctx: GraphQLContext, info) => {
      return await prisma.country.findMany();
    },
  },
};

export default countryResolver;
