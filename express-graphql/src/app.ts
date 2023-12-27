import exceptionsMiddleware from "@/src/middlewares/exceptions.middleware";
import unknownRoutesMiddleware from "@/src/middlewares/unknown-routes.middleware";
import apiRouter from "@/src/routes";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import { simpleEstimator } from "graphql-query-complexity";
import { graphqlContextHandler } from "./graphql/context";
import { isPublicDirectiveResolver } from "./graphql/directives/is-public/is-public.directive";
import { rolesDirectiveResolver } from "./graphql/directives/roles/roles.directive";
import { createComplexityPlugin } from "./graphql/plugins/complexity.plugin";
import paginationMiddleware from "./middlewares/pagination.middleware";
import sortingMiddleware from "./middlewares/sorting.middleware";
import { globalThrottler } from "./middlewares/throttler.middleware";
const port = 3000;
require("express-async-errors");

const app = express();

async function bootstrap() {
  // add .env variables to process.env
  dotenv.config();

  // extends dayjs with plugins
  dayjs.locale("fr");
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  // disable `x-powered-by` header for security reasons
  app.disable("x-powered-by");

  // Trust the `X-Forwarded-For` header for cloudflare and other reverse proxies
  // to send the real IP address of the client by this header.
  app.set("trust proxy", true);

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // enable files upload
  app.use(fileUpload());

  app.use(sortingMiddleware);

  app.use(paginationMiddleware);

  // ----------------------------------------
  // GraphQL
  // ----------------------------------------
  let schema = makeExecutableSchema({
    typeDefs: await loadFiles("src/graphql/**/*.gql"),
    resolvers: await loadFiles("src/graphql/**/*.resolver.{js,ts}"),
  });

  // Directives
  schema = isPublicDirectiveResolver(schema);

  schema = rolesDirectiveResolver(schema);

  // Apollo Server
  const server = new ApolloServer({
    schema,
    plugins: [
      createComplexityPlugin({
        schema,
        maximumComplexity: 100,
        estimators: [simpleEstimator({ defaultComplexity: 1 })],
        onComplete: (complexity) => {
          // console.log("Query Complexity:", complexity); // for debug purposes
        },
      }),
    ],
  });

  // Note you must call `start()` on the `ApolloServer` before passing the instance to `expressMiddleware`
  await server.start();

  app.use(
    "/api/graphql",
    expressMiddleware(server, {
      context: graphqlContextHandler,
    })
  );

  // ----------------------------------------
  // Routes
  // ----------------------------------------
  app.use("/api", globalThrottler, apiRouter);

  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------
  app.use(exceptionsMiddleware);

  app.listen(port, () => {
    console.log(`🚀  Server ready on port: ${port}`);
  });
}

bootstrap();

export { app };
