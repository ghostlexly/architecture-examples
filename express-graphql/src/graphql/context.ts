import { Account, Customer, Housekeeper } from "@prisma/client";
import { sessionsStrategy } from "./operations/auth/strategies/sessions.strategy";

type CustomAccount = Account & {
  housekeeper: Housekeeper;
  customer: Customer;
};

type GraphQLContext = {
  account: CustomAccount | false;
};

const graphqlContextHandler = async ({ req, res }): Promise<GraphQLContext> => {
  // ----------------------------------------
  // Authentication
  // ----------------------------------------
  let account: CustomAccount | false = false;
  try {
    account = await sessionsStrategy(req, res);
  } catch (err) {
    // console.log(err);
  }

  // ----------------------------------------
  // Prisma Select
  // ----------------------------------------
  // const requestedFields = parse(req.body.query);
  // // console.log(requestedFields);
  // visit(requestedFields, {
  //   Document(node: any) {
  //     // console.log(node);
  //     console.log(node.definitions[0].selectionSet?.selections);
  //   },
  // });

  return { account };
};

export { graphqlContextHandler, GraphQLContext };
