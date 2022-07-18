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
    //
    const name = req.body.name;
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;

    await StoreService.getInstance().createStore({
      name,
      email,
      description,
      phone,
      signedCookies: req.signedCookies,
    });
    res.redirect("/store");
  }
}
