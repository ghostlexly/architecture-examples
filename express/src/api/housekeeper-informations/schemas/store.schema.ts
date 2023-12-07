import { z } from "zod";

const body = z.object({
  firstName: z.string().nonempty().max(191),
  lastName: z.string().nonempty().max(191),
  phoneNumber: z.string().nonempty().max(191),
  dateOfBirth: z.coerce.date(),
  nationality: z.string().nonempty().max(2),
});

export default { body };
