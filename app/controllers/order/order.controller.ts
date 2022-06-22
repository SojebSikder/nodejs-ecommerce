import { Request, Response } from "express";

export class OrderController{
  /**
   * show all data
   * @param req
   * @param res
   */
  async index(req: Request, res: Response) {
    res.send("Hello world");
  }
}
 
 