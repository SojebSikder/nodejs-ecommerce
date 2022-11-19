import { Request, Response } from "express";
import passport from "passport";
import { Auth, env } from "../../../system/src";
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
    const user = req.user;
    // prepare the user object to generate token
    const userObject = {
      userid: user.id,
      username: user.username,
      email: user.email,
    };

    // generate token
    const token = Auth.generateAccessToken(userObject);
    // after sucessfull login set cookie and localstorage
    res.cookie(env("COOKIE_NAME"), token, {
      maxAge: env("JWT_EXPIRY"),
      httpOnly: true,
      signed: true,
    });
    res.redirect("/profile");
  }
}
