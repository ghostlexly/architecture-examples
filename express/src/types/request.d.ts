import { Account, Customer, Housekeeper, Prisma } from "@prisma/client";
import { prisma } from "../providers/database/prisma";

export type CustomAccount = Account & {
  housekeeper: Housekeeper;
  customer: Customer;
};

declare global {
  namespace Express {
    interface Request {
      // Overwrite the existing user type with your custom user type
      account: CustomAccount;

      meta: {
        sorting?: {
          include?: any;
          orderBy?: any;
        };
        pagination?: {
          skip: number;
          take: number;
        };
        filters?: {
          where: any;
        };
      };
    }
  }
}

declare module "express" {
  export interface Request {
    // Overwrite the existing request's user type with your custom user type
    account: CustomAccount;
  }
}

export {};
