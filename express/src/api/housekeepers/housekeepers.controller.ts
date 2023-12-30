import registerSchema from "./schemas/register.schema";
import { prisma } from "@/src/providers/database/prisma";
import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { validate } from "@/src/middlewares/validate.middleware";

const register = async (req: Request, res: Response) => {
  const { body } = await validate({ req, schema: registerSchema });

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
