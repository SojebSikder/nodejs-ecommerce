import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { env } from "../../../system/util";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { ProductService } from "./product.service";

@Controller("/")
export class ProductController {
  @Get("", { middleware: [decorateHtmlResponse()] })
  async index(req: Request, res: Response) {
    const result = await ProductService.getInstance().index();

    res.render("index", { posts: result });
  }

  @Post("product/add", { middleware: [decorateHtmlResponse()] })
  async store(req: Request, res: Response) {
    await ProductService.getInstance().store(req, res);

    res.render("post/addPost", {
      message: "Post has been added successfully",
    });
  }

  @Get("product/add", { middleware: [decorateHtmlResponse()] })
  showAddPostPage(req: Request, res: Response) {
    res.render("post/addPost", {
      message: "",
    });
  }

  @Get("product/:id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }
}
