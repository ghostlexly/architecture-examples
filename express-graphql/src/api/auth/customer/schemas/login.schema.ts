import { z } from "zod";

const body = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default { body };
