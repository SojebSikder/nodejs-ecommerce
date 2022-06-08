import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../system/core";

const prisma = new PrismaClient();

export class CartService {
  private static _instance: CartService;
  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
  /**
   * show all data
   */
  public async index() {
    const result = await prisma.cart.findMany();
    return result;
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(arg_id: string) {
    const id = arg_id;
    const result = await prisma.cart.findFirst({
      where: {
        id: Number(id),
      },
    });
    return result;
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store(req: Request, res: Response) {
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    const user = Auth.userByCookie(req.signedCookies);

    const result = await prisma.cart.create({
      data: {
        productId: productId,
        userId: user.userid,
        quantity: quantity,
      },
    });
  }
}
