import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import {
  GraphQLField,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  defaultFieldResolver,
} from "graphql";

type AddDirectiveTransformerProps = {
  schema: any;
  directiveName: string;
  callback: (
    resolve: (source: any, args: any, context: any, info: any) => unknown,
    field: GraphQLFieldConfig<any, any> | GraphQLField<any, any>,
    directive: Record<string, any>,
    source: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => Promise<void>;
};

const addDirectiveTransformer = ({
  schema,
  directiveName,
  callback,
}: AddDirectiveTransformerProps) => {
  return mapSchema(schema, {
    // ----------------------------------------
    // Executes once for each [Field] definitions in the schema
    // ----------------------------------------
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (directive) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with function that "first" calls
        fieldConfig.resolve = async function (source, args, context, info) {
          return callback(
            resolve,
            fieldConfig,
            directive,
            source,
            args,
            context,
            info
          );
        };

        return fieldConfig;
      }
    },

    // ----------------------------------------
    // Executes once for each [Type] definitions in the schema
    // ----------------------------------------
    [MapperKind.OBJECT_TYPE]: (fieldConfig) => {
      // Check whether this Type has the specified directive
      const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (directive) {
        // Extract the fields from this GraphQL Type
        const fields = fieldConfig.getFields();

        // Iterate over each field in this GraphQL Type
        Object.keys(fields).map((fieldName) => {
          const field = fields[fieldName];
          const { resolve = defaultFieldResolver } = field;

          // Replace the original resolver with function that "first" calls
          field.resolve = async function (source, args, context, info) {
            return callback(
              resolve,
              field,
              directive,
              source,
              args,
              context,
              info
            );
          };
        });

        return fieldConfig;
      }
    },
  });
};

export { addDirectiveTransformer };
