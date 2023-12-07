import dayjs from "dayjs";
import { createZodDto } from "src/lib/zod-validation.pipe";
import { ZodError, z } from "zod";

const StoreSchema = z
  .object({
    startDate: z.string().pipe(z.coerce.date()),
    endDate: z.string().pipe(z.coerce.date()),

    intervals: z.array(
      z.object({
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }),
    ),
  })
  // --------------------
  // Check if startDate is before endDate
  // --------------------
  .refine((data) => {
    const start = dayjs(data?.startDate);
    const end = dayjs(data?.endDate);

    if (start.isAfter(end)) {
      throw new ZodError([
        {
          code: "custom",
          path: ["startDate"],
          message: `La date de début ${start.format(
            "DD/MM/YYYY",
          )} est après la date de fin ${end.format("DD/MM/YYYY")}.`,
        },
      ]);
    }

    return true;
  })

  // --------------------
  // Check if startTime is before endTime
  // --------------------
  .refine((data) => {
    data?.intervals.map((interval, index) => {
      const start = dayjs(interval.startTime, "HH:mm");
      const end = dayjs(interval.endTime, "HH:mm");

      if (start.isAfter(end)) {
        throw new ZodError([
          {
            code: "custom",
            path: ["intervals", index, "startTime"],
            message: `L'heure de départ ${start.format(
              "HH:mm",
            )} est après l'heure de fin ${end.format("HH:mm")}.`,
          },
        ]);
      }
    });

    return true;
  })

  // --------------------
  // Check if startTime is not the same as endTime
  // --------------------
  .refine((data) => {
    data?.intervals.map((interval, index) => {
      const start = dayjs(interval.startTime, "HH:mm");
      const end = dayjs(interval.endTime, "HH:mm");

      if (start.isSame(end)) {
        throw new ZodError([
          {
            code: "custom",
            path: ["intervals", index, "startTime"],
            message: `L'heure de départ ${start.format(
              "HH:mm",
            )} est la même que l'heure de fin ${end.format(
              "HH:mm",
            )}. L'heure de fin doit être différente de l'heure de départ.`,
          },
        ]);
      }
    });

    return true;
  });

export class StoreDto extends createZodDto(StoreSchema) {}
