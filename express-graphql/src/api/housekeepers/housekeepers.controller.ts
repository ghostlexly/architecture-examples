import { TypedRequest } from "@/src/middlewares/validate.middleware";
import registerSchema from "./schemas/register.schema";
import { prisma } from "@/src/providers/database/prisma";
import { Response } from "express";
import bcrypt from "bcryptjs";

const register = async (
  { body }: TypedRequest<typeof registerSchema>,
  res: Response
) => {
  const hashedPassword = await bcrypt.hash(body.password, 10);

  // --------------------------------
  // Create user
  // --------------------------------
  await prisma.housekeeper.create({
    data: {
      email: body.email,
      password: hashedPassword,
      account: {
        create: {
          role: "HOUSEKEEPER",
        },
      },
    },
  });

  return res.json({ message: "Votre compte a bien été créé." });
};

export default { register };
