import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { env } from "../../../system/util";
import { UserService } from "./user.service";
import { Controller, Get, Post } from "../../../system/decorator";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { Auth } from "../../../system";
import { authorization } from "../../middlewares/authorization";

const prisma = new PrismaClient();

@Controller("/")
export class UserController {
  @Get("login", { middleware: [decorateHtmlResponse("Login")] })
  async showLoginPage(req: Request, res: Response) {
    res.render("auth/login", {
      message: null,
    });
  }

  @Post("login", { middleware: [decorateHtmlResponse("Login")] })
  async signin(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    const result = await UserService.getInstance().login(email, password);

    if (result.statusCode === 200) {
      // after sucessfull login set cookie and localstorage
      res.cookie(env("COOKIE_NAME"), result.token, {
        maxAge: env("JWT_EXPIRY"),
        httpOnly: true,
        signed: true,
      });

      // set logged in user local identifier
      res.locals.loggedInUser = result.data;
      res.redirect("/");
    } else if (result.statusCode === 401) {
      res.render("auth/login", {
        message: result.message,
      });
    } else if (result.statusCode === 500) {
      res.render("auth/login", {
        message: result.message,
      });
    }
  }

  @Get("register", { middleware: [decorateHtmlResponse()] })
  async showRegisterPage(req: Request, res: Response) {
    res.render("auth/register", {
      message: null,
    });
  }

  @Post("login", { middleware: [decorateHtmlResponse()] })
  async signup(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const email = req.body.email;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const result = await prisma.user.create({
        data: {
          username: name,
          email: email,
          password: hashedPassword,
        },
      });

      res.render("auth/login", {
        message: "Account created successfully. Please login.",
      });
    } catch (error) {
      res.render("auth/register", {
        message: error,
      });
    }
  }

  @Get("logout", { middleware: [decorateHtmlResponse()] })
  async logout(req: Request, res: Response) {
    res.clearCookie(env("COOKIE_NAME"));
    res.render("auth/login", {
      message: "Logged out successfully",
    });
  }

  @Get("profile", {
    middleware: [decorateHtmlResponse("Profile"), authorization()],
  })
  showProfilePage(req: Request, res: Response) {
    res.render("profile/index");
  }
}
