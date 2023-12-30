import { z } from "zod";

const body = z.object({
  IBAN: z
    .string()
    .transform((v) => v.replace(/[ _]/g, ""))
    .pipe(z.string().min(15).max(34).toUpperCase()),

  BIC: z
    .string()
    .transform((v) => v.replace(/[ _]/g, ""))
    .pipe(z.string().min(8).max(11).toUpperCase()),

  accountOwnerName: z.string().nonempty().max(191),

  ownerAddress: z.object({
    address: z.string().nonempty().max(191),
    addressDetails: z.string().max(191).optional(),
    city: z.string().nonempty().max(191),
    postalCode: z.string().nonempty().max(191),
  }),
});

export default { body };
