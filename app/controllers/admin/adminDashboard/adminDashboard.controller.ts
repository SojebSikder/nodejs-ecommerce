import { Request, Response } from "express";
import { Controller, Get } from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { AdminDashboardService } from "./adminDashboard.service";

@Controller("/admin/")
export class AdminDashboardController {
  //
  @Get("", { middleware: [decorateHtmlResponse()] })
  async index(req: Request, res: Response) {
    res.render("admin/dashboard/index");
  }
}
