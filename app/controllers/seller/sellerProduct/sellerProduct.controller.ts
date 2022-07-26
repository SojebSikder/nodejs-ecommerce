import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
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
      });
    } else {
      result = await SellerProductService.getInstance().findAll({
        page: Number(page),
        signedCookies: req.signedCookies,
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
  addProductPage(req: Request, res: Response) {
    res.render("seller/product/add");
  }

  @Post()
  async create(req: Request, res: Response) {
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const published = req.body.published;

    const result = await SellerProductService.getInstance().create({
      productName: name,
      productDescription: description,
      Price: price,
      Stock: stock,
      Published: published,
      image: file,
      signedCookies: req.signedCookies,
    });
    res.render("seller/product/add");
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await SellerProductService.getInstance().findOne(req.params.id));
  }

  @Put(":id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const published = req.body.published;

    res.send(
      await SellerProductService.getInstance().update(id, {
        productName: name,
        productDescription: description,
        Price: price,
        Stock: stock,
        Published: published,
        image: file,
        signedCookies: req.signedCookies,
      })
    );
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    const id = req.params.id;
    res.send(
      await SellerProductService.getInstance().remove(id, {
        signedCookies: req.signedCookies,
      })
    );
  }
}
