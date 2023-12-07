import { HousekeeperDocumentType } from "@prisma/client";
import { z } from "zod";

const params = z.object({
  type: z.nativeEnum(HousekeeperDocumentType),
});

export default { params };
