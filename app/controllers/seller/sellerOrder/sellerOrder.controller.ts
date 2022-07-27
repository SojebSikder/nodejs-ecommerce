import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { SellerOrderService } from "./sellerOrder.service";

@Controller("/seller/order/")
export class SellerOrderController {
  //
  @Get("", { middleware: [decorateHtmlResponse("My Order")] })
  async findAll(req: Request, res: Response) {
    const result = await SellerOrderService.getInstance().findAll({
      signedCookies: req.signedCookies,
    });
    res.render("seller/order/index", { orders: result });
  }

  @Get(":id", { middleware: [decorateHtmlResponse("My Order")] })
  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const result = await SellerOrderService.getInstance().findOne(id, {
      signedCookies: req.signedCookies,
    });
    res.render("seller/order/show", { orders: result });
  }

  @Post("mark/:id")
  async markOrder(req: Request, res: Response) {
    //
    const id = req.params.id;
    const status = req.body.status;
    const result = await SellerOrderService.getInstance().markOrder(id, {
      signedCookies: req.signedCookies,
      status: status,
    });
    res.redirect("/seller/order");
  }
}
