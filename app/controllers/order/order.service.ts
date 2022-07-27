import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth, Mail } from "../../../system/src/core";
import { PaypalMethod } from "../paymentDetails/lib/method/paypal";
import { StripeMethod } from "../paymentDetails/lib/method/stripe";
import { PaymentService } from "../paymentDetails/lib/payment.service";
// import { PaymentDetailsService } from "../paymentDetails/paymentDetails.service";

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
   */
  public async index({ page = 1, signedCookies }) {
    const user = Auth.userByCookie(signedCookies);

    const paginationResult = await prisma.order.findMany({
      where: {
        id: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let limit = 15;
    let pagination = Math.ceil(paginationResult.length / limit);

    const result = await prisma.order.findMany({
      where: {
        id: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return { data: result, pagination: pagination };
  }

  /**
   * show specific data
   */
  async show({ Id, SignedCookies }) {
    const id = Id;
    const user = Auth.userByCookie(SignedCookies);
    const result = await prisma.order.findFirst({
      where: {
        orderId: String(id),
        userId: Number(user.userid),
      },
      select: {
        orderId: true,
        createdAt: true,
        status: true,
        price: true,
        paymentStatus: true,
        SubOrder: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        OrderItem: {
          select: {
            quantity: true,
            price: true,
            product: {
              select: {
                shop: {
                  select: {
                    ShopDetails: true,
                  },
                },
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
    console.log(result)
    return result;
  }

  /**
   * store data
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

    let prices = carts.map((cart) => cart.product.price * cart.quantity);

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
      order_id = "ECOM00000001";
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

    // store to order item
    for (const cart of carts) {
      // store to orderProductItem first
      await this.storeOrderProductItem({
        Price: cart.product.price,
        ProductId: cart.productId,
        Quantity: cart.quantity,
        OrderId: String(order_id),
        OrderItemId: orderItemId,
        signedCookies: req.signedCookies,
      });

      // insert to suborders
      let subprice = cart.product.price * cart.quantity;
      const suborders = await prisma.subOrder.create({
        data: {
          orderId: `${order_id}`,
          sellerId: cart.product.authorId,
          total: `${subprice}`,
        },
      });

      // insert to suborder items
      const subordersItem = await prisma.subOrderItem.create({
        data: {
          subOrderId: suborders.id,
          productId: cart.productId,
          quantity: cart.quantity,
          price: cart.product.price,
        },
      });
    }

    // make payment
    await this.pay({
      orderID: order_id,
      signedCookies: req.signedCookies,
      req,
      res,
    });

    // send email to user
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
   * pay for existing order
   */
  async pay({ orderID, signedCookies, req, res }) {
    let orderId = orderID;
    const paymentMethod = req.query.pm; // stripe, paypal
    let totalPrice;

    const user = Auth.userByCookie(signedCookies);
    // get price from cart
    const order = await prisma.order.findFirst({
      where: {
        orderId: String(orderId),
        userId: user.userid,
      },
      select: {
        orderId: true,
        createdAt: true,
        total: true,
        status: true,
        price: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            product: true,
          },
        },
      },
    });

    totalPrice = order.price;

    // store to orderProductItem to send to paypal
    const items = [];
    const itemsForStripe = [];

    for (const orderItem of order.OrderItem) {
      // store to orderProductItem first

      // for paypal
      items.push({
        name: orderItem.product.name,
        price: String(orderItem.product.price.toFixed(2)),
        currency: "USD",
        quantity: orderItem.quantity,
      });

      // for stripe
      itemsForStripe.push({
        price_data: {
          currency: "USD",
          product_data: {
            name: orderItem.product.name,
          },
          unit_amount: String(orderItem.product.price * 100),
        },
        quantity: orderItem.quantity,
      });
    }
    // make payment
    try {
      let paymentMethods;
      if (paymentMethod == "stripe") {
        paymentMethods = new StripeMethod();
        const paymentService = new PaymentService(paymentMethods);
        paymentService.init();

        paymentService.store({
          orderID: orderId,
          items: itemsForStripe,
          TotalPrice: String(totalPrice.toFixed(2) * 100), // making it in cents
          redirect_callback: async (value) => {
            res.redirect(value);
          },
        });
      } else {
        paymentMethods = new PaypalMethod();
        const paymentService = new PaymentService(paymentMethods);
        paymentService.init();

        paymentService.store({
          orderID: orderId,
          items: items,
          TotalPrice: String(totalPrice.toFixed(2)),
          redirect_callback: async (value) => {
            res.redirect(value);
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    // send email to user
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
    return;
  }

  /**
   * store order product item
   */
  async storeOrderProductItem({
    ProductId,
    Quantity,
    Price,
    OrderId,
    OrderItemId,
    signedCookies,
  }) {
    let orderItemId = OrderItemId;
    let orderId = OrderId;
    let productId = ProductId;
    let quantity = Quantity;
    let price = Price;

    const user = Auth.userByCookie(signedCookies);

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

  /**
   * update specific data
   */
  async update({
    Id,
    SignedCookies,
    status = "order_confirmed",
    paid = "NOT_PAID",
    updateStock = false,
  }) {
    const id = Id;
    const user = Auth.userByCookie(SignedCookies);
    const result = await prisma.order.findFirst({
      where: {
        orderId: String(id),
        userId: Number(user.userid),
      },
      select: {
        orderId: true,
        createdAt: true,
        total: true,
        status: true,
        price: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            product: true,
          },
        },
      },
    });
    if (result) {
      // update payment status and order status
      await prisma.order.update({
        where: {
          orderId: String(id),
        },
        data: {
          paymentStatus: paid,
          status: status,
        },
      });
      // update product stock
      if (updateStock) {
        for (const orderItem of result.OrderItem) {
          // update product quantity from product
          await prisma.product.update({
            where: {
              id: orderItem.product.id,
            },
            data: {
              stock: orderItem.product.stock - orderItem.quantity,
            },
          });
        }
      }
    }
    return result;
  }
}
