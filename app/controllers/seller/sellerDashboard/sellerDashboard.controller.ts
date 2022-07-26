import { Request, Response } from "express";
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
} from "../../../../system/src/core/decorator";
import { authorization } from "../../../middlewares/authorization";
import { isSeller, requireRole } from "../../../middlewares/common/checkLogin";
import { decorateHtmlResponse } from "../../../middlewares/common/decorateHtmlResponse";
import { SellerDashboardService } from "./sellerDashboard.service";

@Controller("/seller/")
export class SellerDashboardController {
  //
  @Get("", {
    middleware: [isSeller(), authorization(), decorateHtmlResponse("My Shop")],
  })
  async findAll(req: Request, res: Response) {
    res.render("seller/dashboard/index");
  }
}
