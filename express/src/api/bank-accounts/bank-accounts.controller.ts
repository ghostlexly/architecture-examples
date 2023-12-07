import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import storeSchema from "./schemas/store.schema";
import updateSchema from "./schemas/update.schema";

const index = async ({ user }: Request, res: Response) => {
  const data = await prisma.bankAccount.findMany({
    include: {
      ownerAddress: true,
    },
    where: {
      ownerId: user.id,
    },
  });

  return res.json(data);
};

const store = async (
  { user, body }: TypedRequest<typeof storeSchema>,
  res: Response
) => {
  // get user bank accounts
  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      ownerId: user.id,
    },
  });

  // the bank account should be primary if it's the first one
  const isPrimary = bankAccounts.length > 0 ? false : true;

  const data = await prisma.$transaction(async (prisma) => {
    // create owner address
    const ownerAddress = await prisma.address.create({
      data: {
        ...body.ownerAddress,
        country: "FR",
        ownerId: user.id,
      },
    });

    // create bank account
    return await prisma.bankAccount.create({
      data: {
        accountOwnerName: body.accountOwnerName,
        IBAN: body.IBAN,
        BIC: body.BIC,
        ownerAddressId: ownerAddress.id,
        isPrimary: isPrimary,
        ownerId: user.id,
      },
    });
  });

  return res.json(data);
};

const update = async (
  { body, params, user }: TypedRequest<typeof updateSchema>,
  res: Response,
  next: NextFunction
) => {
  // find bank account
  const bankAccount = await prisma.bankAccount.findFirst({
    where: {
      id: params.id,
      ownerId: user.id,
    },
  });

  if (!bankAccount) {
    throw createHttpError.NotFound("Bank account not found");
  }

  // update bank account
  const data = await prisma.bankAccount.update({
    where: {
      id: bankAccount.id,
    },
    data: {
      IBAN: body.IBAN,
      BIC: body.BIC,
      accountOwnerName: body.accountOwnerName,
      ownerAddress: {
        update: {
          address: body.ownerAddress?.address,
          addressDetails: body.ownerAddress?.addressDetails,
          city: body.ownerAddress?.city,
          postalCode: body.ownerAddress?.postalCode,
        },
      },
    },
  });

  return res.json(data);
};

export default { index, store, update };
