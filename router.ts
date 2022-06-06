// external imports
import { Express, Request, Response } from "express";

// internal imports
import postRouter from "./routes/postRouter";
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
  app.use(postRouter);
  app.use(decorateHtmlResponse(), userRouter);
  app.use("/admin", adminIndexRouter);

  app.get("*", function (req: Request, res: Response) {
    res.render("404");
  });
}
