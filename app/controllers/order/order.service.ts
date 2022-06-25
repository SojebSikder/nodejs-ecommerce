import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class OrderService {
  private static _instance: OrderService;
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
   * @returns
   */
  public async index(signedCookies) {
    const user = Auth.userByCookie(signedCookies);
    const result = await prisma.order.findMany({
      where: {
        id: user.userId,
      },
    });
    return result;
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(arg_id: string) {
    const id = arg_id;
    const result = await prisma.order.findFirst({
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
    const user = Auth.userByCookie(req.signedCookies);

    let order_id;
    const latestOrder = await prisma.order.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (latestOrder) {
      order_id = "HLCY" + `${latestOrder.id + 1}`.padStart(8, "0");
    } else {
      order_id = 1;
    }

    const result = await prisma.order.create({
      data: {
        userId: user.userid,
        orderId: `${order_id}`,
        orderItemId: "",
        price: "100",
        discount: "",
        delivery_fee: "",
        total: "",
        paymentStatus: "",
        paymentMode: "",
        status: "order_placed",
      },
    });

    return result;
  }
}
