import { Request, Response } from "express";
import {
  Controller,
  Get,
  Post,
} from "../../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../../middlewares/common/decorateHtmlResponse";
import { AdminCategoryService } from "./adminCategory.service";

@Controller("/admin/product/category/", {
  middleware: [decorateHtmlResponse()],
})
export class AdminCategoryController {
  //
  @Get("test")
  async showCategory(req: Request, res: Response) {
    const data = await AdminCategoryService.getInstance().showCategory();
    res.json({ data });
  }

  @Get("add")
  async createPage(req: Request, res: Response) {
    const result = await AdminCategoryService.getInstance().findAll();
    res.render("admin/product/category/add", { categories: result });
  }

  @Post()
  async create(req: Request, res: Response) {
    const name = req.body.name;
    const parentId = req.body.parent;
    const published = req.body.published;

    const result = await AdminCategoryService.getInstance().create({
      name: name,
      parentId: parentId,
      published: published,
    });

    const category = await AdminCategoryService.getInstance().findAll();

    res.render("admin/product/category/add", {
      message: "Category created successfully",
      categories: category,
    });
  }

  @Get()
  async findAll(req: Request, res: Response) {
    const result = await AdminCategoryService.getInstance().findAll();
    res.render("admin/product/category/index", { category: result });
  }

  @Get("edit/:id")
  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const result = await AdminCategoryService.getInstance().findOne(id);
    res.render("admin/product/category/edit", { category: result });
  }

  @Post("edit/:id")
  async update(req: Request, res: Response) {
    const id = req.params.id;
    const { name } = req.body;
    const result = await AdminCategoryService.getInstance().update(id, {
      name: name,
    });

    res.render("admin/product/category/edit", {
      category: result,
      message: "Updated successfully",
    });
  }

  @Get("delete/:id")
  async remove(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await AdminCategoryService.getInstance().remove(id);

      res.locals.message = "Deleted successfully";
      res.redirect("/admin/product/category");
    } catch (error) {
      res.locals.message = "Something went wrong";
      res.redirect("/admin/product/category");
    }
  }
}
