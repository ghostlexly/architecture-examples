import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dayjs from "dayjs";
import { Response } from "express";
import loginSchema from "./schemas/login.schema";

const login = async (
  { body }: TypedRequest<typeof loginSchema>,
  res: Response
) => {
  // ------------------
  // check if user exists
  // ------------------
  const user = await prisma.customer.findFirst({
    include: {
      account: true,
    },
    where: { email: body.email },
  });

  if (!user) {
    return res.status(401).json({
      description: "Les identifiants que vous avez saisis sont invalides.",
    });
  }

  // ------------------
  // hash given password and compare it to the stored hash
  // ------------------
  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      description: "Les identifiants que vous avez saisis sont invalides.",
    });
  }

  // ------------------
  // generate session token
  // ------------------
  const session = await prisma.session.create({
    data: {
      expiresAt: dayjs.utc().add(7, "day").toDate(),
      sessionToken: crypto.randomUUID(),
      accountId: user.accountId,
    },
  });

  res.json({ access_token: session.sessionToken });
};

export default { login };
