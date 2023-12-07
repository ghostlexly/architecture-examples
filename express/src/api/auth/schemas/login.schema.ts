import { Role } from "@prisma/client";
import { z } from "zod";

const body = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(Role),
});

export default { body };
