import { Request, Response } from "express";
import { env } from "../../../system/src";
import { Controller, Get, Post, Put } from "../../../system/src/core/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { ShopService } from "./shop.service";

@Controller("/shop/")
export class ShopController {
  //
  @Get("createshop", {
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

  @Post("createshop", {
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

  @Get("", {
    middleware: [decorateHtmlResponse("Shop")],
  })
  async findAll(req: Request, res: Response) {
    //
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    let result;
    if (q != undefined) {
      result = await ShopService.getInstance().findAll({
        page: Number(page),
        isSearch: true,
        searchText: String(q),
      });
    } else {
      result = await ShopService.getInstance().findAll({
        page: Number(page),
      });
    }

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;

    result = await ShopService.getInstance().findAll({});
    console.log(result.data);
    res.render("shop/index", {
      shops: result,
      page: page,
      search: { q: q, count: result.data.length, time: resultTime + " ms" },
    });
  }

  @Get(":name", {
    middleware: [decorateHtmlResponse("Shop")],
  })
  async shop(req: Request, res: Response) {
    //
    const name = req.params.name;
    res.locals.title = `${name} - ${env("APP_NAME")}`;
    const result = await ShopService.getInstance().findOne({
      name: name,
      signedCookies: req.signedCookies,
    });
    res.render("shop/showOne", { shop: result });
  }
}
