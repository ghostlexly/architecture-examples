import { Request, Response } from "express";
import createHttpError from "http-errors";

const getMe = ({ account }: Request, res: Response) => {
  if (account.role === "HOUSEKEEPER") {
    return res.json({
      id: account.housekeeper.id,
      email: account.housekeeper.email,
      role: account.role,
    });
  } else if (account.role === "CUSTOMER") {
    return res.json({
      id: account.customer.id,
      email: account.customer.email,
      role: account.role,
    });
  } else {
    throw createHttpError.BadRequest("Invalid role");
  }
};

export default { getMe };
