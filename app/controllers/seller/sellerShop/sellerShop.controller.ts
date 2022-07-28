import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { SellerShopService } from "./sellerShop.service";

@Controller("/seller/shop/")
export class SellerShopController {
  //

  @Get("", { middleware: [decorateHtmlResponse("MY Shop")] })
  async indexPage(req: Request, res: Response) {
    const result = await SellerShopService.getInstance().index({
      signedCookies: req.signedCookies,
    });
    res.render("seller/shop/index", { shop: result });
  }

  @Get("edit", {
    middleware: [decorateHtmlResponse("Edit shop")],
  })
  async updatePage(req: Request, res: Response) {
    const result = await SellerShopService.getInstance().index({
      signedCookies: req.signedCookies,
    });

    res.render("seller/shop/edit", { shop: result });
  }

  @Post("edit", {
    middleware: [decorateHtmlResponse("Edit shop")],
  })
  async update(req: Request, res: Response) {
    //
    const name = req.body.name || null;
    const displayName = req.body.displayname;
    const sellerStatus = req.body.sellerStatus == "on" ? "active" : "deactive";
    const email = req.body.email;
    const description = req.body.description;
    const phone = req.body.phone;
    const shopcommand = req.body.shopcommand || null;

    let result;
    if (shopcommand) {
      result = await SellerShopService.getInstance().updateShop({
        status: shopcommand,
        signedCookies: req.signedCookies,
      });

      res.redirect("/seller/shop");
    } else {
      result = await SellerShopService.getInstance().updateShopDetails({
        name,
        displayName,
        sellerStatus,
        email,
        description,
        phone,
        signedCookies: req.signedCookies,
      });

      const updated = await SellerShopService.getInstance().index({
        signedCookies: req.signedCookies,
      });

      // res.render("seller/shop/edit", {
      //   message: result.message,
      //   shop: updated,
      // });
      res.redirect("/seller/shop/edit");
    }
  }
}
