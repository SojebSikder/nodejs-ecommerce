import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { env } from "../../../system/util";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { attachmentUpload } from "../../middlewares/common/upload";
import { ProductService } from "./product.service";

@Controller("/")
export class ProductController {
  @Get("", { middleware: [decorateHtmlResponse()] })
  async index(req: Request, res: Response) {
    //
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    let result;
    if (q != undefined) {
      result = await ProductService.getInstance().index({
        page: Number(page),
        isSearch: true,
        searchText: String(q),
      });
    } else {
      result = await ProductService.getInstance().index({
        page: Number(page),
      });
    }

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;
    res.render("index", {
      posts: result,
      page: page,
      search: { q: q, count: result.data.length, time: resultTime + " ms" },
    });
  }

  @Post("product/add", {
    middleware: [
      decorateHtmlResponse(),
      attachmentUpload({
        fieldname: [{ name: "image", maxCount: 1 }],
        distination: "products",
      }),
    ],
  })
  async store(req: Request, res: Response) {
    //
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
