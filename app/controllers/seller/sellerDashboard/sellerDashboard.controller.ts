import { Request, Response } from "express";
import { Controller, Get } from "../../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { SellerDashboardService } from "./sellerDashboard.service";

@Controller("/seller/")
export class SellerDashboardController {
  //
  @Get("", {
    middleware: [decorateHtmlResponse("My Shop")],
  })
  async findAll(req: Request, res: Response) {
    res.render("seller/dashboard/index");
  }
}
