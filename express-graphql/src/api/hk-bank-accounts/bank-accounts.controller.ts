import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import storeSchema from "./schemas/store.schema";
import updateSchema from "./schemas/update.schema";

const findAll = async ({ account }: Request, res: Response) => {
  const data = await prisma.housekeeperBankAccount.findMany({
    include: {
      ownerAddress: true,
    },
    where: {
      ownerId: account.housekeeper.id,
    },
  });

  return res.json(data);
};

const create = async (
  { account, body }: TypedRequest<typeof storeSchema>,
  res: Response
) => {
  // get user bank accounts
  const bankAccounts = await prisma.housekeeperBankAccount.findMany({
    where: {
      ownerId: account.housekeeper.id,
    },
  });

  // the bank account should be primary if it's the first one
  const isPrimary = bankAccounts.length > 0 ? false : true;

  const data = await prisma.$transaction(async (prisma) => {
    // create owner address
    const ownerAddress = await prisma.housekeeperAddress.create({
      data: {
        ...body.ownerAddress,
        country: "FR",
        ownerId: account.housekeeper.id,
      },
    });

    // create bank account
    return await prisma.housekeeperBankAccount.create({
      data: {
        accountOwnerName: body.accountOwnerName,
        IBAN: body.IBAN,
        BIC: body.BIC,
        ownerAddressId: ownerAddress.id,
        isPrimary: isPrimary,
        ownerId: account.housekeeper.id,
      },
    });
  });

  return res.json(data);
};

const update = async (
  { body, params, account }: TypedRequest<typeof updateSchema>,
  res: Response,
  next: NextFunction
) => {
  // find bank account
  const bankAccount = await prisma.housekeeperBankAccount.findFirst({
    where: {
      id: params.id,
      ownerId: account.housekeeper.id,
    },
  });

  if (!bankAccount) {
    throw createHttpError.NotFound("Bank account not found");
  }

  // update bank account
  const data = await prisma.housekeeperBankAccount.update({
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

export default { findAll, create, update };
