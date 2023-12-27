import { ComplexityEstimator, getComplexity } from "graphql-query-complexity";
import { GraphQLError, GraphQLSchema, separateOperations } from "graphql";
import { BaseContext, ApolloServerPlugin } from "@apollo/server";

export const createComplexityPlugin = ({
  schema,
  maximumComplexity,
  estimators,
  onComplete,
}: {
  schema: GraphQLSchema;
  maximumComplexity: number;
  estimators: Array<ComplexityEstimator>;
  onComplete?: (complexity: number) => void;
}): ApolloServerPlugin<BaseContext> => {
  return {
    requestDidStart: async () => ({
      didResolveOperation: async ({ request, document }) => {
        const query = request.operationName
          ? separateOperations(document)[request.operationName]
          : document;

        const complexity = getComplexity({
          schema,
          query,
          variables: request.variables,
          estimators,
        });

        if (complexity >= maximumComplexity) {
          throw new GraphQLError(
            `Query too complex. Value of ${complexity} is over the maximum ${maximumComplexity}.`
          );
        }
        if (onComplete) {
          onComplete(complexity);
        }
      },
    }),
  };
};
