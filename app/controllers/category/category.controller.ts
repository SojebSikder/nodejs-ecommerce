import { Request, Response } from "express";
import { Controller, Get } from "../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { ProductService } from "../product/product.service";
import { CategoryService } from "./category.service";

@Controller("/category/", { middleware: [decorateHtmlResponse()] })
export class CategoryController {
  //
  @Get(":name")
  async findByCategory(req: Request, res: Response) {
    //
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    const categoryName = req.params.name;
    let result;

    if (q != undefined) {
      result = await ProductService.getInstance().findByCategory({
        page: Number(page),
        categoryName: categoryName,
      });
    } else {
      result = await ProductService.getInstance().findByCategory({
        page: Number(page),
        categoryName: categoryName,
      });
    }

    const categoryDetails = await CategoryService.getInstance().findOneBySlug({
      slug: categoryName,
    });

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;

    res.render("post/category/index", {
      posts: result,
      page: page,
      search: { q: q, count: result.data.length, time: resultTime + " ms" },
      categoryName: categoryDetails.name,
    });
  }
}
