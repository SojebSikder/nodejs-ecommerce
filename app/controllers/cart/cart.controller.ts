import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "./cart.service";

@Controller("/cart/")
export class CartController {
  @Get("", { middleware: [decorateHtmlResponse("Cart"), authorization()] })
  async index(req: Request, res: Response) {
    const result = await CartService.getInstance().index(req.signedCookies);
    res.render("cart/index", { carts: result });
  }

  @Post("add", {
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

  @Post(":id/delete", { middleware: [decorateHtmlResponse(), authorization()] })
  async delete(req: Request, res: Response) {
    const id = req.params.id;
    const result = await CartService.getInstance().delete(id);
    if (result) {
      res.redirect("/cart");
    } else {
      res.send("Something went wrong :(");
    }
  }
  @Get(":id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    res.send("Hello world");
  }
}
