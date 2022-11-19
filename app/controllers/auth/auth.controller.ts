import { Request, Response } from "express";
import passport from "passport";
import { Controller, Get } from "../../../system/src/core/decorator";
import { AuthService } from "./auth.service";

(() => {
  AuthService.getInstance().googleStrategy(passport);
})();

@Controller("/auth/")
export class AuthController {
  //
  @Get("google/redirect", {
    middleware: [AuthService.getInstance().redirectToGoogleAuth()],
  })
  redirectToGoogleAuth(req: Request, res: Response) {}

  @Get("google", {
    middleware: [AuthService.getInstance().googleAuthCallback()],
  })
  googleAuthCallback(req: Request, res: Response) {
    res.redirect("/profile");
  }
}
