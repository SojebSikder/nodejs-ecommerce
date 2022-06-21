import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "./cart.service";

@Controller("/cart/")
export class CartController {
  @Get("")
  async index(req: Request, res: Response) {
    res.send("Hello world");
  }

  @Post("product/add", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async store(req: Request, res: Response) {
    const productId = req.body.productId;
    const quantity = req.body.qnty;

    await CartService.getInstance().store({
      productId: productId,
      quantity: quantity,
      signedCookies: req.signedCookies,
    });

    const backURL = req.header("Referer") || "/";
    res.redirect(backURL);
  }

  @Get("product/:id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    res.send("Hello world");
  }
}
