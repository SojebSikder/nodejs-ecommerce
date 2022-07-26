import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { SellerProductService } from "./sellerProduct.service";

@Controller("/seller/product/")
export class SellerProductController {
  //
  @Get("add", { middleware: [decorateHtmlResponse()] })
  addProductPage(req: Request, res: Response) {
    res.render("seller/product/add");
  }

  @Post()
  async create(req: Request, res: Response) {
    res.send(await SellerProductService.getInstance().create(req.body));
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await SellerProductService.getInstance().findOne(req.params.id));
  }

  @Patch(":id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    res.send(await SellerProductService.getInstance().update(id, data));
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    res.send(await SellerProductService.getInstance().remove(req.params.id));
  }
}
