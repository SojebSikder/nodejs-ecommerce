import { Request, Response } from "express";
import { Controller, Get } from "../../../../system/src/core/decorator";
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
    const result = await SellerOrderService.getInstance().findOne(
      req.params.id,
      {
        signedCookies: req.signedCookies,
      }
    );
    res.render("seller/order/show", { orders: result });
  }
}
