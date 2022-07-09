// external imports
import { Express } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
// internal imports
// middleware imports
import { appConfig } from "../config/app";
import { rootResolver } from "../graphql/resolvers";
import { schema } from "../graphql/schema";
import { logger } from "../app/middlewares/logger";
import { setUser } from "./middlewares/authorization";

/**
 * Use any middleware here
 */
export function boot(app: Express) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(appConfig.cookieSecret));
  // custom middleware here
  app.use(logger);
  app.use(setUser());
  // graphql endpoint
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      rootValue: rootResolver,
      graphiql: true,
    })
  );
}
