import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { env } from "../../../system/util";
import { UserService } from "./user.service";

const prisma = new PrismaClient();

export class UserController {
  /**
   * Show Login page /get method
   * @param req
   * @param res
   */
  async showLoginPage(req: Request, res: Response) {
    res.render("auth/login", {
      message: null,
    });
  }
  /**
   * Process login /post method
   * @param req
   * @param res
   */
  async signin(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    const result = await UserService.getInstance().login(email, password);

    if (result.statusCode === 200) {
      // after sucessfull login set cookie
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

  /**
   * Show Register page /get method
   * @param req
   * @param res
   */
  async showRegisterPage(req: Request, res: Response) {
    res.render("auth/register", {
      message: null,
    });
  }
  /**
   * Process register /post method
   * @param req
   * @param res
   */
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

  // do logout
  async logout(req: Request, res: Response) {
    res.clearCookie(env("COOKIE_NAME"));
    res.render("auth/login", {
      message: "Logged out successfully",
    });
  }

  // show profile page
  showProfilePage(req: Request, res: Response) {
    res.render("profile/index");
  }
}
