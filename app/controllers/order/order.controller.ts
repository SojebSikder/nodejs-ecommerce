import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";
import { v4 as uuidv4 } from "uuid";

@Controller("/order")
export class OrderController {
  //
  @Get("", { middleware: [decorateHtmlResponse("My Order"), authorization()] })
  async index(req: Request, res: Response) {
    const data = await OrderService.getInstance().index(req.signedCookies);

    res.send(data);
  }

  @Get("/checkout", {
    middleware: [decorateHtmlResponse("Checkout"), authorization()],
  })
  async checkoutPage(req: Request, res: Response) {
    const uuid = uuidv4();
    const result = await CartService.getInstance().index(req.signedCookies);
    res.render("order/checkout", { uuid: uuid, carts: result });
  }

  @Get("/success", { middleware: [decorateHtmlResponse("Success")] })
  successPage(req: Request, res: Response) {
    res.render("order/success");
  }

  @Post("/", {
    middleware: [decorateHtmlResponse("My Order"), authorization()],
  })
  async store(req: Request, res: Response) {
    const data = await OrderService.getInstance().store(req, res);

    res.send(data);
  }
}
