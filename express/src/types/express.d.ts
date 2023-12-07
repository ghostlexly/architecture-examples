import { User as IUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      // Overwrite the existing user type with your custom user type
      user: IUser;
    }
  }
}

declare module "express" {
  export interface Request {
    // Overwrite the existing request's user type with your custom user type
    user: IUser;
  }
}

export {};
