import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { Response } from "express";
import registerSchema from "./schemas/register.schema";
import bcrypt from "bcryptjs";

const create = async (
  { body }: TypedRequest<typeof registerSchema>,
  res: Response
) => {
  const hashedPassword = await bcrypt.hash(body.password, 10);

  await prisma.customer.create({
    data: {
      email: body.email,
      password: hashedPassword,
      account: {
        create: {
          role: "CUSTOMER",
        },
      },
    },
  });

  return res.json({ message: "Votre compte a bien été créé." });
};

export default { create };
