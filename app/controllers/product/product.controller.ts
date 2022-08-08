import { Request, Response } from "express";
import { Controller, Get } from "../../../system/src/core/decorator";
import { env } from "../../../system/src/util";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { ProductService } from "./product.service";

@Controller("/", { middleware: [decorateHtmlResponse()] })
export class ProductController {
  //

  @Get("test")
  async showCategory(req: Request, res: Response) {
    const data = await ProductService.getInstance().showCategory();
    res.json({ data });
  }

  @Get()
  async index(req: Request, res: Response) {
    //
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    const ajax = req.query.ajax;
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

    if (ajax) {
      res.json({
        posts: result,
        page: page,
        search: { q: q, count: result.data.length, time: resultTime + " ms" },
      });
    } else {
      res.render("index", {
        posts: result,
        page: page,
        search: { q: q, count: result.data.length, time: resultTime + " ms" },
      });
    }
  }

  @Get("search")
  async search(req: Request, res: Response) {
    //
    const startTime = new Date().getTime();
    const q = req.query.q;
    let result;
    if (q != undefined) {
      if (q == "") {
        result = { data: [] };
      } else {
        result = await ProductService.getInstance().search({
          searchText: String(q),
        });
      }
    }

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;

    if (q == "") {
      res.json({
        posts: result,
      });
    } else {
      res.json({
        posts: result,
        search: { q: q, count: result.data.length, time: resultTime + " ms" },
      });
    }
  }

  @Get("product/:id")
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }
}
