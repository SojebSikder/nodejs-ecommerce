import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../../system/src/core/decorator";
import { env } from "../../../../system/src/util";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { IndexService } from "./index.service";

@Controller("/admin/")
export class IndexController {
  @Get("", { middleware: [decorateHtmlResponse()] })
  async index(req: Request, res: Response) {
    const result = await IndexService.getInstance().index();
    res.render("admin/index");
  }

  @Post("post/add", { middleware: [decorateHtmlResponse()] })
  async store(req: Request, res: Response) {
    await IndexService.getInstance().store(req, res);

    res.render("post/addPost", {
      message: "Post has been added successfully",
    });
  }

  @Get("post/add", { middleware: [decorateHtmlResponse()] })
  showAddPostPage(req: Request, res: Response) {
    res.render("post/addPost", {
      message: "",
    });
  }

  @Get("post/:id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await IndexService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }
}
