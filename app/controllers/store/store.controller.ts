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
    let isStore = false;
    const result = await StoreService.getInstance().index({
      signedCookies: req.signedCookies,
    });
    if (result) {
      isStore = true;
    }
    res.render("store/myStore", { store: result, isStore: isStore });
  }

  @Get("/createstore", {
    middleware: [authorization(), decorateHtmlResponse("Create store")],
  })
  async createstorePage(req: Request, res: Response) {
    res.render("store/createStore");
  }

  @Post("/createstore", {
    middleware: [authorization(), decorateHtmlResponse("Create store")],
  })
  async createstore(req: Request, res: Response) {
    //
    const name = req.body.name;
    const displayName = req.body.displayname;
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;

    const result = await StoreService.getInstance().createStore({
      name,
      displayName,
      email,
      description,
      phone,
      signedCookies: req.signedCookies,
    });

    res.render("store/createStore", {
      message: result.message,
    });
  }
}
