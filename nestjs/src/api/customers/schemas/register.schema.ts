import * as bcrypt from "bcryptjs";
import { createZodDto } from "src/lib/zod-validation.pipe";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),

  password: z
    .string()
    .min(6)
    .max(100)
    .transform(async (value) => await bcrypt.hash(value, 10)),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
