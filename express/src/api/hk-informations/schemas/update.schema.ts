import parsePhoneNumberFromString from "libphonenumber-js";
import { z } from "zod";

const body = z
  .object({
    firstName: z.string().nonempty().max(191),
    lastName: z.string().nonempty().max(191),
    phoneNumber: z.string().nonempty().max(191),
    dateOfBirth: z.coerce.date(),
    nationality: z.string().nonempty().max(2),
  })
  .partial()

  // ------------------------------------
  // Check if phone number is valid
  // ------------------------------------
  .refine(
    (data) => {
      try {
        if (!data.phoneNumber) return true;

        const parsedPhoneNumber = parsePhoneNumberFromString(
          data.phoneNumber,
          "FR"
        );

        if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    {
      path: ["phoneNumber"],
      message: "Le numéro de téléphone n'est pas valide.",
    }
  );

const params = z.object({
  id: z.coerce.number(),
});

export default { body, params };
