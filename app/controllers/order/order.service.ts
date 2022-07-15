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
    const orderItemId = req.body.orderItemId;
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
      order_id = "ECOM" + `${latestOrder.id + 1}`.padStart(8, "0");
    } else {
      order_id = "1";
    }

    // store to order
    const result = await prisma.order.create({
      data: {
        userId: Number(user.userid),
        orderId: `${order_id}`,
        orderItemId: `${orderItemId}`,
        price: price,
        discount: `${discount}`,
        delivery_fee: `${delivery_fee}`,
        total: `${total}`,
        paymentStatus: "NOT_PAID",
        paymentMode: "COD",
        status: "order_placed",
      },
    });

    // store to orderProductItem first
    await this.storeOrderProductItem({
      OrderId: order_id,
      OrderItemId: orderItemId,
      signedCookies: req.signedCookies,
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
  async storeOrderProductItem({ OrderId, OrderItemId, signedCookies }) {
    // let orderId = req.body.orderId;
    // let productId = req.body.productId;
    // let quantity = req.body.quantity;
    // let price = req.body.price;
    let orderItemId = OrderItemId;
    let orderId = OrderId;
    let productId;
    let quantity;
    let price;

    const user = Auth.userByCookie(signedCookies);

    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.userid,
      },
      include: {
        product: true,
      },
    });

    productId = cart.productId;
    quantity = cart.quantity;
    price = cart.product.price;

    // store to orderProductItem
    const result = await prisma.orderItem.create({
      data: {
        orderId: orderId,
        productId: productId,
        quantity: quantity,
        price: price,
        orderItemId: orderItemId,
      },
    });

    await prisma.cart.delete({ where: { id: cart.id } });
    return result;
  }
}
