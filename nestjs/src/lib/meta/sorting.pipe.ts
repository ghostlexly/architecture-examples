import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

export class MetaSortingPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    const [column, direction] = value.split(":");

    // --------------------
    // Nested sorting
    // --------------------
    if (column.includes(".")) {
      const relationalColumns = column.split(".");

      return {
        include: {
          [relationalColumns[0]]: {
            orderBy: {
              [relationalColumns[1]]: direction.toLowerCase() as "asc" | "desc",
            },
          },
        },
      };
    }

    // --------------------
    // Simple sorting
    // --------------------
    return {
      orderBy: {
        [column]: direction.toLowerCase() as "asc" | "desc",
      },
    };
  }
}
