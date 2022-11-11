import { Request, Response } from "express";
import { body } from "express-validator";
import { Controller, Get, Post } from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { attachmentUpload } from "../../../middlewares/common/upload";
import { SellerProductService } from "./sellerProduct.service";

@Controller("/seller/product/")
export class SellerProductController {
  //
  @Get("", {
    middleware: [decorateHtmlResponse()],
  })
  async viewProductPage(req: Request, res: Response) {
    // show product for store owner
    const startTime = new Date().getTime();
    const page = req.query.page == undefined ? 1 : req.query.page;
    const q = req.query.q;
    let result;
    if (q != undefined) {
      result = await SellerProductService.getInstance().findAll({
        page: Number(page),
        isSearch: true,
        searchText: String(q),
        signedCookies: req.signedCookies,
        domain: req['subDomain'],
      });
    } else {
      result = await SellerProductService.getInstance().findAll({
        page: Number(page),
        signedCookies: req.signedCookies,
        domain: req['subDomain'],
      });
    }

    const endTime = new Date().getTime();
    const resultTime = endTime - startTime;
    res.render("seller/product/index", {
      posts: result,
      page: page,
      search: { q: q, count: result.data.length, time: resultTime + " ms" },
    });
  }

  @Get("add", { middleware: [decorateHtmlResponse()] })
  async addProductPage(req: Request, res: Response) {
    const category = await SellerProductService.getInstance().getCategory();
    res.render("seller/product/add", { categories: category });
  }

  @Post("", {
    middleware: [
      decorateHtmlResponse(),
      body("name").isString().isLength({ min: 1 }).trim().escape(),
      body("description").isLength({ min: 1 }).escape(),
      body("price").isLength({ min: 1 }).escape(),
      body("stock").isLength({ min: 1 }).escape(),
      body("published").isLength({ min: 1 }).escape(),
      body("categoryId").isLength({ min: 1 }).escape(),
      attachmentUpload({
        fieldname: [{ name: "image", maxCount: 1 }],
        distination: "products",
      }),
    ],
  })
  async create(req: Request, res: Response) {
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const published = req.body.published;
    const categoryId = req.body.category;

    const result = await SellerProductService.getInstance().create({
      productName: name,
      productDescription: description,
      Price: price,
      Stock: stock,
      Published: published,
      image: file,
      categoryId: categoryId,
      signedCookies: req.signedCookies,
      domain: req['subDomain'],
    });

    const category = await SellerProductService.getInstance().getCategory();
    res.render("seller/product/add", {
      message: "Post has been added successfully",
      categories: category,
    });
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await SellerProductService.getInstance().findOne(req.params.id));
  }

  @Get("edit/:id", {
    middleware: [decorateHtmlResponse()],
  })
  async edit(req: Request, res: Response) {
    const id = req.params.id;
    const result = await SellerProductService.getInstance().edit({
      Id: id,
      signedCookies: req.signedCookies,
      domain: req['subDomain'],
    });

    const category = await SellerProductService.getInstance().getCategory();

    res.render("seller/product/edit", { post: result, categories: category });
  }

  @Post("edit/:id", {
    middleware: [
      decorateHtmlResponse(),
      body("name").isString().isLength({ min: 1 }).trim().escape(),
      body("description").isLength({ min: 1 }).escape(),
      body("price").isLength({ min: 1 }).escape(),
      body("stock").isLength({ min: 1 }).escape(),
      body("published").isLength({ min: 1 }).escape(),
      body("categoryId").isLength({ min: 1 }).escape(),
      attachmentUpload({
        distination: "products",
        fieldname: [{ name: "image", maxCount: 1 }],
      }),
    ],
  })
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const categoryId = req.body.category;
    const published = req.body.published;

    await SellerProductService.getInstance().update(id, {
      productName: name,
      productDescription: description,
      Price: price,
      Stock: stock,
      categoryId: categoryId,
      Published: published,
      image: file,
      signedCookies: req.signedCookies,
      domain: req['subDomain'],
    });

    res.redirect(`/seller/product/edit/${id}`);
  }

  @Get("delete/:id")
  async remove(req: Request, res: Response) {
    const id = req.params.id;
    await SellerProductService.getInstance().remove(id, {
      signedCookies: req.signedCookies,
      domain: req['subDomain'],
    });
    res.redirect("/seller/product");
  }
}
