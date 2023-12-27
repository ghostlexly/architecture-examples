import { prisma } from "@/src/providers/database/prisma";
import { z } from "zod";

const body = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (value) => {
        const user = await prisma.customer.findFirst({
          where: { email: value },
        });
        return !user;
      },
      { message: "Cette adresse e-mail est déjà utilisée." }
    ),
  password: z.string().min(6).max(100),
});

export default { body };
