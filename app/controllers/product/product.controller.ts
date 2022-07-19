import { Request, Response } from "express";
import { Auth } from "../../../system";
import { Controller, Get, Post } from "../../../system/decorator";
import { env } from "../../../system/util";
import { authorization } from "../../middlewares/authorization";
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

  @Get("store/product", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async storeProductPage(req: Request, res: Response) {
    // show product for store owner
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    let result;
    if (q != undefined) {
      result = await ProductService.getInstance().showProductForStore({
        page: Number(page),
        isSearch: true,
        searchText: String(q),
        signedCookies: req.signedCookies,
      });
    } else {
      result = await ProductService.getInstance().showProductForStore({
        page: Number(page),
        signedCookies: req.signedCookies,
      });
    }

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;
    res.render("store/product/index", {
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

  @Get("product/edit/:id", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async updatePage(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().edit({
      Id: id,
      signedCookies: req.signedCookies,
    });

    res.render("store/product/edit", { post: result });
  }

  @Post("product/edit/:id", {
    middleware: [
      decorateHtmlResponse(),
      authorization(),
      attachmentUpload({
        distination: "products",
        fieldname: [{ name: "image", maxCount: 1 }],
      }),
    ],
  })
  async update(req: Request, res: Response) {
    // save product
    await ProductService.getInstance().update(req, res);

    const id = req.params.id;
    const result = await ProductService.getInstance().edit({
      Id: id,
      signedCookies: req.signedCookies,
    });

    res.render("store/product/edit", { post: result });
  }
}
