import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ArrayHelper } from "../../../system";
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
    let price = req.body.price;
    const orderItemId = req.body.orderItemId;
    let totalPrice;

    const user = Auth.userByCookie(req.signedCookies);
    // get price from cart
    const carts = await prisma.cart.findMany({
      where: {
        userId: user.userid,
      },
      include: {
        product: true,
      },
    });

    let prices = carts.map((cart) => cart.product.price);

    price = prices.reduce(
      (previousValue, currentValue) => previousValue + currentValue
    );

    //

    let order_id;
    let discount = "0";
    let delivery_fee = "0";

    totalPrice = price + Number(delivery_fee);
    totalPrice = totalPrice - price * (Number(discount) / 100);

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
        total: `${totalPrice}`,
        paymentStatus: "NOT_PAID",
        paymentMode: "COD",
        status: "order_placed",
      },
    });

    carts.forEach(async (cart) => {
      console.log(cart.productId);
      // store to orderProductItem first
      await this.storeOrderProductItem({
        Price: cart.product.price,
        ProductId: cart.productId,
        Quantity: cart.quantity,
        OrderId: String(order_id),
        OrderItemId: orderItemId,
        signedCookies: req.signedCookies,
      });
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
  async storeOrderProductItem({
    ProductId,
    Quantity,
    Price,
    OrderId,
    OrderItemId,
    signedCookies,
  }) {
    // let orderId = req.body.orderId;
    // let productId = req.body.productId;
    // let quantity = req.body.quantity;
    // let price = req.body.price;
    let orderItemId = OrderItemId;
    let orderId = OrderId;
    let productId = ProductId;
    let quantity = Quantity;
    let price = Price;

    const user = Auth.userByCookie(signedCookies);

    // const cart = await prisma.cart.findFirst({
    //   where: {
    //     userId: user.userid,
    //   },
    //   include: {
    //     product: true,
    //   },
    // });

    // productId = cart.productId;
    // quantity = cart.quantity;
    // price = cart.product.price;

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

    await prisma.cart.deleteMany({ where: { userId: user.userid } });
    return result;
  }
}