import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { z } from "zod";
import { BadRequestException, HttpStatus } from "@nestjs/common";
import { ZodError } from "zod";

// --------------------------------
// Create a Zod Validation Pipe to validate the DTOs
// --------------------------------
export class ZodValidationPipe implements PipeTransform {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (!metadata.metatype) {
        return value;
      }

      if (!isZodSchema(metadata.metatype)) {
        return value;
      }

      const zodSchema = (metadata?.metatype as ZodDtoStatic<unknown>)
        ?.zodSchema;

      const data = await zodSchema.parseAsync(value);
      return data;
    } catch (error) {
      throw new ZodValidationException(error);
    }
  }
}

const isZodSchema = (metatype: any): metatype is ZodDtoStatic<unknown> => {
  return !!metatype?.zodSchema; // Perform a type guard check
};

// --------------------------------
// Create a Zod DTO Class to transform the Zod Schema into a class for NestJS
// --------------------------------
type CompatibleZodType = z.ZodType<any, any, any>;
type CompatibleZodInfer<T extends CompatibleZodType> = T["_output"];

type ZodDtoStatic<T> = {
  new (): T;
  zodSchema: CompatibleZodType;
};

export const createZodDto = <T extends CompatibleZodType>(
  zodSchema: T,
): ZodDtoStatic<CompatibleZodInfer<T>> => {
  class SchemaHolderClass {
    public static zodSchema = zodSchema;
  }

  return SchemaHolderClass;
};

// --------------------------------
// Create a Zod Exception to handle the Zod errors
// --------------------------------
export class ZodValidationException extends BadRequestException {
  constructor(private zodError: ZodError) {
    // Transform the Zod error into a more readable format
    const violations = zodError.errors.map((error) => {
      return {
        code: error.code,
        message: error.message,
        path: error.path,
      };
    });

    // Call the parent constructor
    // throw a new BadRequestException with the transformed error
    super({
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Le formulaire comporte ${
        Object.values(zodError.errors).length
      } erreur(s). Veuillez les corriger pour continuer.`,
      errors: violations,
    });
  }

  public getZodError() {
    return this.zodError;
  }
}
