import { Request, Response } from "express";
import { Mail } from "../../../system/core/Mail";
import { Controller, Get } from "../../../system/decorator";

@Controller("/example")
export class ExampleController {
  //
  @Get("/")
  async index(req: Request, res: Response) {
    // send email to user
    const email = Mail.to("sojebsikder@gmail.com")
      .subject("Order placed successfully")
      .body("Order placed successfully")
      .send();

    res.send("Email sent");
  }
}
