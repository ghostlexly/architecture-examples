import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import {
  GraphQLError,
  GraphQLField,
  GraphQLFieldConfig,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLSchema,
  defaultFieldResolver,
} from "graphql";
import { GraphQLContext } from "../../context";

const directiveName = "roles";

const rolesDirectiveResolver = (schema: GraphQLSchema) => {
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
          const fieldName = fieldConfig?.astNode?.name.value;

          await resolver({
            directive,
            fieldName,
            fieldConfig,
            source,
            args,
            context,
            info,
          });

          // Call the original resolver
          return resolve(source, args, context, info);
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
            const fieldName = fieldConfig.name;

            await resolver({
              directive,
              field,
              fieldConfig,
              fieldName,
              source,
              args,
              context,
              info,
            });

            // Call the original resolver
            return resolve(source, args, context, info);
          };
        });

        return fieldConfig;
      }
    },
  });
};

type ResolverProps = {
  directive: Record<string, any> | undefined;
  fieldName: string | undefined;
  field?: GraphQLField<any, any>;
  fieldConfig?: GraphQLObjectType | GraphQLFieldConfig<any, any, any>;
  source: any;
  args: any;
  context: GraphQLContext;
  info: GraphQLResolveInfo;
};

const resolver = async ({
  directive,
  fieldName,
  field,
  fieldConfig,
  source,
  args,
  context,
  info,
}: ResolverProps) => {
  // throw new GraphQLError(directive.message);
  // source.dateOfBirth = "CENSORED FIELD";

  if (
    !context.account ||
    (directive?.role && context.account.role !== directive.role)
  ) {
    throw new GraphQLError(
      `You are not authorized to access the resource ${fieldName}.`,
      {
        extensions: {
          code: 403,
          description: "Forbidden",
        },
      }
    );
  }
};

export { rolesDirectiveResolver };
