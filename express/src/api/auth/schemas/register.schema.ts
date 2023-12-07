import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/providers/database/prisma";
import { Role } from "@prisma/client";

const body = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (value) => {
        const user = await prisma.user.findFirst({ where: { email: value } });
        return !user;
      },
      { message: "Cette adresse e-mail est déjà utilisée." }
    ),
  password: z
    .string()
    .min(6)
    .max(100)
    .transform(async (value) => await bcrypt.hash(value, 10)),

  role: z.nativeEnum(Role),
});

export default { body };
