import { Request, Response } from "express";
import { Controller, Get } from "../../../../system/src/core/decorator";
import { SellerOrderService } from "./sellerOrder.service";

@Controller("/seller/order/")
export class SellerOrderController {
  //
  @Get()
  async findAll(req: Request, res: Response) {
    const result = await SellerOrderService.getInstance().findAll({
      signedCookies: req.signedCookies,
    });
    res.send(result);
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    const result = await SellerOrderService.getInstance().findOne(
      req.params.id
    );
    res.send(result);
  }
}
