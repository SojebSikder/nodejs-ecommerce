import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { env, Mail } from "../../../system/src";
import { Controller, Get, Post } from "../../../system/src/core/decorator";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { UserService } from "../user/user.service";
import { RecoverPasswordService } from "./recoverPassword.service";

@Controller("/forget/")
export class RecoverPasswordController {
  //
  @Get("", { middleware: [decorateHtmlResponse()] })
  async index(req: Request, res: Response) {
    res.render("auth/forgetPassword");
  }

  @Post("", { middleware: [decorateHtmlResponse()] })
  async create(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const code = uuidv4();

      // check email is exist
      const checkEmail = await UserService.getInstance().checkEmail({ email });

      if (checkEmail) {
        const result = await RecoverPasswordService.getInstance().create({
          email,
          code,
        });

        // send email to user
        const url = `${req.protocol}://${req.get(
          "host"
        )}/forget/recover/${code}`;

        const sendEmail = Mail.to(email)
          .subject("Recover Password")
          .body(
            `Hello,
This email is for recover password. <br/>

Click this link to reset password. <br/>
<a href="${url}">Recover Password.</a> <br/>
Thank You,
${env("APP_NAME")}`
          )
          .send(true);

        res.render("auth/forgetPassword", {
          message: "Please check you inbox in a minute.",
        });
      } else {
        res.render("auth/forgetPassword", { message: "Email not found" });
      }
    } catch (error) {
      res.render("auth/forgetPassword", { message: "Something went wrong :(" });
    }
  }

  @Get("recover/:code", { middleware: [decorateHtmlResponse()] })
  async recoverPage(req: Request, res: Response) {
    const { code } = req.params;
    res.render("auth/recoverPassword", { code });
  }

  @Post("recover/:code", { middleware: [decorateHtmlResponse()] })
  async recover(req: Request, res: Response) {
    const { code } = req.query;
    const { password } = req.body;
    try {
      const result = await RecoverPasswordService.getInstance().recover({
        code,
        password,
      });
      if (result) {
        res.render("auth/recoverPassword", {
          code,
          message: "Password has been changed.",
        });
      } else {
        res.render("auth/recoverPassword", {
          code,
          message: "Code is not valid.",
        });
      }
    } catch (error) {
      res.render("auth/recoverPassword", {
        code,
        message: "Something went wrong :(",
      });
    }
  }
}
