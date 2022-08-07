import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from "../../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../../middlewares/common/decorateHtmlResponse";
import { AdminCategoryService } from "./adminCategory.service";

@Controller("/admin/product/category/", {
  middleware: [decorateHtmlResponse()],
})
export class AdminCategoryController {
  //
  @Get("add")
  async createPage(req: Request, res: Response) {
    res.render("admin/product/category/add");
  }

  @Post()
  async create(req: Request, res: Response) {
    const name = req.body.name;
    const published = req.body.published;

    const result = await AdminCategoryService.getInstance().create({
      name: name,
      published: published,
    });

    res.render("admin/product/category/add", {
      message: "Category created successfully",
    });
  }

  @Get()
  async findAll(req: Request, res: Response) {
    const result = await AdminCategoryService.getInstance().findAll();
    res.render("admin/product/category/index", { category: result });
  }

  @Get(":id")
  async findOne(req: Request, res: Response) {
    res.send(await AdminCategoryService.getInstance().findOne(req.params.id));
  }

  @Patch(":id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    res.send(await AdminCategoryService.getInstance().update(id, data));
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    res.send(await AdminCategoryService.getInstance().remove(req.params.id));
  }
}
