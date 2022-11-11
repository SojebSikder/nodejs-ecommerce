import { Request, Response } from "express";
import { env } from "../../../../system/src";
import { Controller, Get } from "../../../../system/src/core/decorator";
import { SellerAuthService } from "./sellerAuth.service";

@Controller("/seller/auth/")
export class SellerAuthController {
  //
  @Get("login")
  async login(req: Request, res: Response) {
    const token = req.query.token;
    // after sucessfull login set cookie and localstorage
    res.cookie(env("COOKIE_NAME"), token, {
      maxAge: env("JWT_EXPIRY"),
      httpOnly: true,
      signed: true,
    });
    res.redirect("/seller");
  }
}
