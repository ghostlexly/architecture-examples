import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../context";
import parsePhoneNumberFromString from "libphonenumber-js";
import { prisma } from "@/src/providers/database/prisma";

const housekeeperInformationResolver = {
  // ------------------------------------------------------------
  // TYPES
  // ------------------------------------------------------------
  HousekeeperInformation: {
    companyAddress: async (parent, args, ctx: GraphQLContext, info) => {
      // findUnique() and fluent api is batched by default on Prisma (@see: https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
      return prisma.housekeeperInformation
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .companyAddress();
    },
  },

  // ------------------------------------------------------------
  // QUERIES
  // ------------------------------------------------------------
  Query: {
    housekeeperInformations: async (
      parent,
      args,
      { account }: GraphQLContext,
      info
    ) => {
      // pagination
      const { first, after } = args;
      let ownerId: string | undefined = undefined;

      if (!account) {
        throw new GraphQLError("Unauthorized");
      }

      if (account.role !== "ADMIN") {
        ownerId = account.housekeeper.id;
      }

      const nodes = await prisma.housekeeperInformation.findMany({
        where: {
          ownerId: ownerId,
        },

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

  // ------------------------------------------------------------
  // MUTATIONS
  // ------------------------------------------------------------
  Mutation: {
    createHousekeeperInformations: async (
      parent,
      args,
      { account }: GraphQLContext,
      info
    ) => {
      const { input } = args;

      if (!account) {
        throw new GraphQLError("Unauthorized");
      }

      /**
       * ---------------------
       * Transform phone number to international format
       * ---------------------
       */
      const parsedPhoneNumber = parsePhoneNumberFromString(
        input.phoneNumber,
        "FR"
      );

      if (!parsedPhoneNumber) {
        throw new GraphQLError("Numéro de téléphone invalide.");
      }

      input.phoneNumber = parsedPhoneNumber.formatInternational();

      // ---------------------
      // check if housekeeper informations exists already for this user
      // ---------------------
      const housekeeperInformations =
        await prisma.housekeeperInformation.findFirst({
          where: {
            ownerId: account.housekeeper.id,
          },
        });

      if (housekeeperInformations) {
        throw new GraphQLError("Vous avez déjà complété vos informations.");
      }

      // ---------------------
      // create housekeeper informations
      // ---------------------
      return await prisma.housekeeperInformation.create({
        data: {
          ...input,
          submissionStep: 1,
          ownerId: account.housekeeper.id,
        },
      });
    },

    updateHousekeeperInformations: async (
      parent,
      args,
      { account }: GraphQLContext,
      info
    ) => {
      const { input } = args;

      if (!account) {
        throw new GraphQLError("Unauthorized");
      }

      /**
       * ---------------------
       * Transform phone number to international format
       * ---------------------
       */
      if (input.phoneNumber) {
        const parsedPhoneNumber = parsePhoneNumberFromString(
          input.phoneNumber,
          "FR"
        );

        if (!parsedPhoneNumber) {
          throw new GraphQLError("Numéro de téléphone invalide.");
        }

        input.phoneNumber = parsedPhoneNumber.formatInternational();
      }

      // ---------------------
      // check if housekeeper informations exists already for this user
      // ---------------------
      const housekeeperInformations =
        await prisma.housekeeperInformation.findFirst({
          where: {
            id: args.id,
            ownerId: account.housekeeper.id,
          },
        });

      if (!housekeeperInformations) {
        throw new GraphQLError("Ce dossier n'existe pas.");
      }

      /**
       * -------------------
       * Update housekeeper informations
       * -------------------
       */
      return await prisma.housekeeperInformation.update({
        where: {
          id: housekeeperInformations.id,
        },
        data: {
          ...input,
        },
      });
    },
  },
};

export default housekeeperInformationResolver;
