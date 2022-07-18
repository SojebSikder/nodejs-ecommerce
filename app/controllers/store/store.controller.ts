import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { StoreService } from "./store.service";

@Controller("/store")
export class StoreController {
  //
  @Get("", { middleware: [authorization(), decorateHtmlResponse("My Store")] })
  async index(req: Request, res: Response) {
    res.render("store/myStore");
  }

  @Get("/createstore", {
    middleware: [authorization(), decorateHtmlResponse("Create store")],
  })
  async createstorePage(req: Request, res: Response) {
    res.render("store/createStore");
  }

  @Post("/createstore", {
    middleware: [authorization()],
  })
  async createstore(req: Request, res: Response) {
    await StoreService.getInstance().createStore(req.body);
    res.send("Hello world");
  }
}
