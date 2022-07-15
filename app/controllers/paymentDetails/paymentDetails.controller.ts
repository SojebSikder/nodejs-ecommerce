import { Request, Response } from "express";
import { Controller, Get } from "../../../system/decorator";
    
@Controller("/paymentDetails")
export class PaymentDetailsController {
  //
  @Get("")
  async index(req: Request, res: Response) {
    res.send("Hello world");
  }
  @Get("/about")
  async about(req: Request, res: Response) {
    res.send("Hello world");
  }
}
 