import { Request, Response } from "express";
import { Controller, Get } from "../../../system/src/core/decorator";
import { env } from "../../../system/src/util";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
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

  @Get("product/:id", { middleware: [decorateHtmlResponse()] })
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }
}
