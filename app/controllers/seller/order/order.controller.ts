import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from "../../../../system/src/core/decorator";
import { OrderService } from "./order.service";

@Controller("/order/")
export class OrderController {
  //
  @Post()
  async create(req: Request, res: Response) {
    res.send(await OrderService.getInstance().create(req.body));
  }

  @Get()
  async findAll(req: Request, res: Response) {
    res.send(await OrderService.getInstance().findAll());
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await OrderService.getInstance().findOne(req.params.id));
  }

  @Patch(":id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    res.send(await OrderService.getInstance().update(id, data));
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    res.send(await OrderService.getInstance().remove(req.params.id));
  }
}
