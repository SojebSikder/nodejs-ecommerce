import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from "../../../../system/src/core/decorator";
import { SellerOrderService } from "./sellerOrder.service";

@Controller("/seller/")
export class SellerOrderController {
  //
  @Post()
  async create(req: Request, res: Response) {
    res.send(await SellerOrderService.getInstance().create(req.body));
  }

  @Get()
  async findAll(req: Request, res: Response) {
    res.send(await SellerOrderService.getInstance().findAll());
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await SellerOrderService.getInstance().findOne(req.params.id));
  }

  @Patch(":id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    res.send(await SellerOrderService.getInstance().update(id, data));
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    res.send(await SellerOrderService.getInstance().remove(req.params.id));
  }
}
