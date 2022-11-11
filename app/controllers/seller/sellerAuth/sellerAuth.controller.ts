import { Request, Response } from "express";
import { Controller, Get } from "../../../../system/src/core/decorator";
import { SellerAuthService } from "./sellerAuth.service";

@Controller("/seller/auth/")
export class SellerAuthController {
  //
  @Get("login")
  async login(req: Request, res: Response) {
    const login = await SellerAuthService.getInstance().login();
    res.send("login successfully");
  }
}
