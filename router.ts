// external imports
import { Express, Request, Response } from "express";

// internal imports
import productRouter from "./routes/productRouter";
import userRouter from "./routes/userRouter";
// admin routes
import adminIndexRouter from "./routes/admin/indexRouter";
// middleware
import { decorateHtmlResponse } from "./middlewares/common/decorateHtmlResponse";

/**
 * Init all routes
 * @param {*} app
 */
export function routes(app: Express) {
  app.use(productRouter);
  app.use(decorateHtmlResponse(), userRouter);
  app.use("/admin", adminIndexRouter);

  app.get("*", function (req: Request, res: Response) {
    res.render("404");
  });
}
