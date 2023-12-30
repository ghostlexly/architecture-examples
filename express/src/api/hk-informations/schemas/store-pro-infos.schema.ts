import { z } from "zod";

const insuranceDiscriminator = z.discriminatedUnion("hasInsurance", [
  z.object({ hasInsurance: z.literal(false) }),
  z.object({
    hasInsurance: z.literal(true),
    insurance: z.object({
      societaryNumber: z.string().max(191).nonempty(),
      companyName: z.string().max(191).nonempty(),
    }),
  }),
]);

const personalServiceDiscriminator = z.discriminatedUnion(
  "isDeclaredPersonalService",
  [
    z.object({ isDeclaredPersonalService: z.literal(false) }),
    z.object({
      isDeclaredPersonalService: z.literal(true),
      personalService: z.object({
        sapNumber: z.string().max(191).nonempty(),
        startOfActivity: z.coerce.date(),
      }),
    }),
  ]
);

const body = z
  .object({
    companyName: z.string().nonempty().max(191),
    siretNumber: z
      .string()
      .min(14)
      .max(14)
      .regex(/^\d+$/, "Le numéro de SIRET doit être composé que de chiffres."),
    // sapNumber: z.string().nonempty().max(191),

    companyAddressAddress: z.string().nonempty().max(191),
    companyAddressAddressDetails: z.string().max(191).optional().nullable(),
    hasInsurance: z.boolean(),
    hasDegree: z.boolean(),
    yearsOfExperience: z.coerce.number().min(0).max(100),
    isDeclaredPersonalService: z.boolean(),

    companyAddressPostalCode: z.string().nonempty().max(191),
    companyAddressCity: z.string().nonempty().max(191),
  })
  .and(insuranceDiscriminator)
  .and(personalServiceDiscriminator);

const params = z.object({
  id: z.coerce.number(),
});

export default { body, params };
