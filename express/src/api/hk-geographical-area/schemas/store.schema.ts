import { z } from "zod";

const body = z.object({
  postalCode: z
    .array(
      z.string().min(5).max(5).regex(/^\d+$/, {
        message: "Le code postal ne doit contenir que des chiffres.",
      })
    )
    .nonempty(),
});

export default { body };
