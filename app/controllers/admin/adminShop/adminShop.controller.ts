import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
} from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { AdminShopService } from "./adminShop.service";

@Controller("/admin/shop/")
export class AdminShopController {
  //
  @Post()
  async create(req: Request, res: Response) {
    res.send(await AdminShopService.getInstance().create(req.body));
  }

  @Get("", { middleware: [decorateHtmlResponse()] })
  async findAll(req: Request, res: Response) {
    const result = await AdminShopService.getInstance().findAll();
    res.render("admin/shop/index", { shops: result });
  }

  @Get("edit/:id", { middleware: [decorateHtmlResponse()] })
  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const result = await AdminShopService.getInstance().findOne(id);
    res.render("admin/shop/edit", { shop: result });
  }

  @Put(":id")
  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const name = req.body.name || null;
      const displayName = req.body.displayname;
      const sellerStatus =
        req.body.sellerStatus == "on" ? "active" : "deactive";
      const email = req.body.email;
      const description = req.body.description;
      const phone = req.body.phone;
      const shopcommand = req.body.shopcommand || null;

      let result;
      if (shopcommand) {
        result = await AdminShopService.getInstance().update(id, {
          status: shopcommand,
        });

        res.redirect("/admin/shop");
      } else {
        result = await AdminShopService.getInstance().updateShopDetails({
          shopId: id,
          name,
          displayName,
          sellerStatus,
          email,
          description,
          phone,
        });
      }

      res.status(201).json({
        message: "Updated successfully",
        success: true,
      });
    } catch (error) {
      res.status(201).json({
        message: "Something went wrong",
        success: false,
      });
    }
  }

  @Delete(":id")
  async remove(req: Request, res: Response) {
    try {
      const result = await AdminShopService.getInstance().remove(req.params.id);
      res.json({
        message: "Deleted successfully",
        success: true,
      });
    } catch (error) {
      res.json({
        message: "Something went wrong",
        success: false,
      });
    }
  }
}
