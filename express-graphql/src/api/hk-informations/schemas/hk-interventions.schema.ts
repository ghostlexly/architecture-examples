import { z } from "zod";

const body = z
  .object({
    companyCustomersAllowed: z.boolean().optional(),
    individualCustomersAllowed: z.boolean().optional(),
    hasVehicle: z.boolean().optional(),
    hasCleaningEquipment: z.boolean(),
    minimumServiceDuration: z.coerce.number().min(1),
    weekdayRate: z.coerce.number().min(1),
    sundayHolidayRate: z.coerce.number().min(1),
    nightRate: z.coerce.number().min(1),
    cleaningEquipmentExtraRate: z.coerce.number().min(1),
    vatRate: z.coerce
      .number()
      .refine(
        (data) =>
          [0, 5.5, 10, 20].find(
            (rate) => rate.toString() === data.toString()
          ) !== undefined
      ),
    services: z.array(z.string().nonempty()).nonempty(),
  })
  // check if at least one type of customer is allowed
  .refine(
    (data) => {
      return data.companyCustomersAllowed || data.individualCustomersAllowed;
    },
    {
      message: "Vous devez accepter au moins un type de client.",
      path: ["companyCustomersAllowed"],
    }
  );

const params = z.object({
  id: z.coerce.number(),
});

export default { body, params };
