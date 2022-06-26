import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth, Mail } from "../../../system/core";

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
    const price = req.body.price;
    const orderProductItem = req.body.orderProductItem;
    const totalPrice = req.body.price;

    const user = Auth.userByCookie(req.signedCookies);

    let order_id;
    let discount = "0";
    let delivery_fee = "0";

    let total = totalPrice + Number(delivery_fee);
    total = total - price * (Number(discount) / 100);

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
        orderItemId: `${orderProductItem}`,
        price: `${price}`,
        discount: `${discount}`,
        delivery_fee: `${delivery_fee}`,
        total: `${total}`,
        paymentStatus: "NOT_PAID",
        paymentMode: "COD",
        status: "order_placed",
      },
    });

    // try {
    //   // send email to user
    //   const email = Mail.to(user.email)
    //     .subject("Order placed successfully")
    //     .body("Order placed successfully")
    //     .send();

    //   console.log(email);
    // } catch (error) {
    //   console.log(error);
    // }

    return result;
  }

  /**
   * store order product item
   * @param req
   * @param res
   * @returns
   */
  async storeOrderProductItem(req: Request, res: Response) {
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const result = await prisma.orderItem.create({
      data: {
        orderId: orderId,
        productId: productId,
        quantity: quantity,
      },
    });
    return result;
  }
}
