import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import loginSchema from "./schemas/login.schema";
import registerSchema from "./schemas/register.schema";

async function login(
  { body }: TypedRequest<typeof loginSchema>,
  res: Response
) {
  const user = await prisma.user.findFirst({
    where: { email: body.email, role: body.role },
  });

  // check if user exists
  if (!user) {
    return res.status(401).json({
      description: "Les identifiants que vous avez saisis sont invalides.",
    });
  }

  // hash given password and compare it to the stored hash
  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      description: "Les identifiants que vous avez saisis sont invalides.",
    });
  }

  const tokenPayload = { sub: user.id };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET as Secret, {
    expiresIn: "7d",
  });
  res.json({ access_token: token });
}

async function register(
  { body }: TypedRequest<typeof registerSchema>,
  res: Response
) {
  // register the user in the database
  await prisma.user.create({
    data: {
      ...body,
    },
  });

  return res.json({ message: "Votre compte a bien été créé." });
}

const me = async ({ user }: Request, res: Response) => {
  res.json(user);
};

export default { login, register, me };
