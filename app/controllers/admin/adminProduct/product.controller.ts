import { Request, Response } from "express";
import { env } from "../../../../system/src/util";
import { Controller, Get, Post } from "../../../../system/src/core/decorator";

import { authorization } from "../../../middlewares/authorization";
import { requireRole } from "../../../middlewares/common/checkLogin";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { ProductService } from "./product.service";

@Controller("/admin/product/")
export class AdminProductController {
  //
  @Get("", {
    middleware: [decorateHtmlResponse(), authorization(), requireRole("admin")],
  })
  async index(req: Request, res: Response) {
    const result = await ProductService.getInstance().index();
    res.render("index", { posts: result });
  }

  @Post("add", { middleware: [decorateHtmlResponse()] })
  async store(req: Request, res: Response) {
    await ProductService.getInstance().store(req, res);

    res.render("post/addPost", {
      message: "Post has been added successfully",
    });
  }

  @Get("add", { middleware: [decorateHtmlResponse()] })
  showAddPostPage(req: Request, res: Response) {
    res.render("post/addPost", {
      message: "",
    });
  }

  @Get(":id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await ProductService.getInstance().show(id);
      res.locals.title = `${result.name} - ${env("APP_NAME")}`;
      res.render("post/postSingle", { post: result });
    } catch (error) {
      res.redirect("/error");
    }
  }
}
