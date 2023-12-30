import { prisma } from "@/src/providers/database/prisma";
import { CustomerType } from "@prisma/client";
import { z } from "zod";

const body = z.object({
  postalCode: z.string().min(5).max(5),
  minimumDuration: z.coerce.number().min(1).max(20),
  customerType: z.nativeEnum(CustomerType),
  services: z.array(
    z.string().refine(async (value) => {
      const services = await prisma.housekeeperService.findMany();

      return services.some((service) => service.key === value);
    })
  ),
});

export default { body };
