import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";

@Controller("/order")
export class OrderController {
  @Get("", { middleware: [decorateHtmlResponse("My Order"), authorization()] })
  async index(req: Request, res: Response) {
    const data = await OrderService.getInstance().index(req.signedCookies);

    res.send(data);
  }

  @Get("/checkout", {
    middleware: [decorateHtmlResponse("Checkout"), authorization()],
  })
  async checkoutPage(req: Request, res: Response) {
    const result = await CartService.getInstance().index(req.signedCookies);
    res.render("order/checkout", { carts: result });
  }

  @Post("/", {
    middleware: [decorateHtmlResponse("My Order"), authorization()],
  })
  async store(req: Request, res: Response) {
    const data = await OrderService.getInstance().store(req, res);

    res.send(data);
  }
}
