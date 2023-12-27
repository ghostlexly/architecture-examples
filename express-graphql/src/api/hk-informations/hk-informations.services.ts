import { prisma } from "@/src/providers/database/prisma";
import { CustomAccount } from "@/src/types/request";
import createHttpError from "http-errors";

const getHousekeeperInformations = async ({
  account,
}: {
  account: CustomAccount;
}) => {
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      include: {
        insurance: true,
      },
      where: {
        ownerId: account?.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  return housekeeperInformations;
};

export default { getHousekeeperInformations };
