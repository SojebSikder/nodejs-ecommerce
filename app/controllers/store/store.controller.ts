import { Request, Response } from "express";
import { Controller, Get } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";

@Controller("/store")
export class StoreController {
  //
  @Get("", { middleware: [authorization(), decorateHtmlResponse("My Store")] })
  async index(req: Request, res: Response) {
    res.render("store/myStore");
  }
  @Get("/about")
  async about(req: Request, res: Response) {
    res.send("Hello world");
  }
}
