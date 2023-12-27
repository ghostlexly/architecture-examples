import { prisma } from "@/src/providers/database/prisma";
import { z } from "zod";

const params = z.object({
  id: z
    .string()
    .uuid()
    .refine(
      async (value) => {
        const user = await prisma.housekeeperAvailability.findFirst({
          where: { id: value },
        });

        return user;
      },
      { message: "Cette disponibilité n'existe pas ou a déjà été supprimée." }
    ),
});

export default { params };
