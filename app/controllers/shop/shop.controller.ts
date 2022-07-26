import { Request, Response } from "express";
import { Controller, Get, Post, Put } from "../../../system/src/core/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { ShopService } from "./shop.service";

@Controller("/shop")
export class ShopController {
  //
  @Get("", { middleware: [authorization(), decorateHtmlResponse("My Store")] })
  async index(req: Request, res: Response) {
    res.send("all shop here");
  }

  @Get("/createshop", {
    middleware: [authorization(), decorateHtmlResponse("Create shop")],
  })
  async createshopPage(req: Request, res: Response) {
    let isShop = false;
    const result = await ShopService.getInstance().index({
      signedCookies: req.signedCookies,
    });
    if (result) {
      isShop = true;
      res.render("shop/create-shop", {
        message: result.status,
        isShop: isShop,
      });
    } else {
      res.render("shop/create-shop", { message: "", isShop: isShop });
    }
  }

  @Post("/createshop", {
    middleware: [authorization(), decorateHtmlResponse("Create shop")],
  })
  async createshop(req: Request, res: Response) {
    //
    const name = req.body.name;
    const displayName = req.body.displayname;
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;

    const result = await ShopService.getInstance().createShop({
      name,
      displayName,
      email,
      description,
      phone,
      signedCookies: req.signedCookies,
    });

    if (result.success == true) {
      res.redirect("/shop/createshop");
    } else {
      res.render("shop/create-shop", {
        message: result.message,
      });
    }
  }

  @Get("/editshop", {
    middleware: [authorization(), decorateHtmlResponse("Edit shop")],
  })
  async updateshopPage(req: Request, res: Response) {
    const result = await ShopService.getInstance().index({
      signedCookies: req.signedCookies,
    });

    res.render("shop/editShop", { shop: result });
  }

  @Post("/editshop", {
    middleware: [authorization(), decorateHtmlResponse("Create shop")],
  })
  async updateshop(req: Request, res: Response) {
    //
    const name = req.body.name || null;
    const displayName = req.body.displayname;
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;
    const shopcommand = req.body.shopcommand || null;

    let result;
    if (shopcommand) {
      result = await ShopService.getInstance().updateShop({
        status: shopcommand,
        signedCookies: req.signedCookies,
      });

      res.redirect("/shop");
    } else {
      result = await ShopService.getInstance().updateShopDetails({
        name,
        displayName,
        email,
        description,
        phone,
        signedCookies: req.signedCookies,
      });

      const updated = await ShopService.getInstance().index({
        signedCookies: req.signedCookies,
      });

      res.render("shop/editStore", {
        message: result.message,
        store: updated,
      });
    }
  }
}
