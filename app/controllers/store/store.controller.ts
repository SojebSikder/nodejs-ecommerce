import { Request, Response } from "express";
import { Controller, Get, Post, Put } from "../../../system/decorator";
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
  createstorePage(req: Request, res: Response) {
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

    if (result.success == true) {
      res.redirect("/store");
    } else {
      res.render("store/createStore", {
        message: result.message,
      });
    }
  }

  @Get("/editstore", {
    middleware: [authorization(), decorateHtmlResponse("Edit store")],
  })
  async updatestorePage(req: Request, res: Response) {
    const result = await StoreService.getInstance().index({
      signedCookies: req.signedCookies,
    });

    res.render("store/editStore", { store: result });
  }

  @Post("/editstore", {
    middleware: [authorization(), decorateHtmlResponse("Create store")],
  })
  async updatestore(req: Request, res: Response) {
    //
    const name = req.body.name || null;
    const displayName = req.body.displayname;
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;
    const storecommand = req.body.storecommand || null;

    let result;
    if (storecommand) {
      result = await StoreService.getInstance().updateStore({
        status: storecommand,
        signedCookies: req.signedCookies,
      });

      res.redirect("/store");
    } else {
      result = await StoreService.getInstance().updateStoreDetails({
        name,
        displayName,
        email,
        description,
        phone,
        signedCookies: req.signedCookies,
      });

      const updated = await StoreService.getInstance().index({
        signedCookies: req.signedCookies,
      });

      res.render("store/editStore", {
        message: result.message,
        store: updated,
      });
    }
  }
}
