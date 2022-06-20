import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";

@Controller("/cart/")
export class CartController {
  @Get("")
  async index(req: Request, res: Response) {
    res.send("Hello world");
  }
  @Get("product/add", { middleware: [decorateHtmlResponse()] })
  async showAddPostPage(req: Request, res: Response) {
    res.send("Hello world");
  }
  @Post("product/add", { middleware: [decorateHtmlResponse()] })
  async store(req: Request, res: Response) {
    res.send("Hello world");
  }
  @Get("product/:id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    res.send("Hello world");
  }
}
