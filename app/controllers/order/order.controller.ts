import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/src/core/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";
import { v4 as uuidv4 } from "uuid";
import { PaymentService } from "../paymentDetails/lib/payment.service";
import { PaypalMethod } from "../paymentDetails/lib/method/paypal";
import { StripeMethod } from "../paymentDetails/lib/method/stripe";

let fullUrl;
@Controller("/order")
export class OrderController {
  //
  @Get("", { middleware: [decorateHtmlResponse("My Order"), authorization()] })
  async index(req: Request, res: Response) {
    //
    const page = req.query.page == undefined ? 1 : req.query.page;
    const data = await OrderService.getInstance().index({
      page: Number(page),
      signedCookies: req.signedCookies,
    });
    // set urls for refer
    fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    //
    res.render("order/myOrder", { orders: data, page: page });
  }

  @Get("/checkout", {
    middleware: [decorateHtmlResponse("Checkout"), authorization()],
  })
  async checkoutPage(req: Request, res: Response) {
    //
    const uuid = uuidv4();
    const result = await CartService.getInstance().index(req.signedCookies);
    res.render("order/checkout", { uuid: uuid, carts: result });
  }

  @Get("/success", { middleware: [decorateHtmlResponse("Success")] })
  async successPage(req: Request, res: Response) {
    //
    const orderID = req.query.orderID;
    const paymentMethod = req.query.pm;

    let paymentMethods;
    if (paymentMethod == "stripe") {
      paymentMethods = new StripeMethod();
    } else if (paymentMethod == "paypal") {
      paymentMethods = new PaypalMethod();
    } else if (paymentMethod == "cod") {
      // implement cash on delivery
    }
    
    //
    const paymentService = new PaymentService(paymentMethods);
    paymentService.init();
    await paymentService.success({
      price: req.query.amount,
      PayerID: req.query.PayerID,
      PaymentID: req.query.paymentId,
      success_callback: async () => {
        // update order status
        await OrderService.getInstance().update({
          Id: orderID,
          paid: "PAID",
          SignedCookies: req.signedCookies,
          updateStock: true,
        });
        // render success page
        res.render("order/success");
      },
    });
  }

  @Get("/cancel", { middleware: [decorateHtmlResponse("Cancel")] })
  cancelPage(req: Request, res: Response) {
    res.render("order/cancel");
  }

  @Post("/", {
    middleware: [decorateHtmlResponse("My Order"), authorization()],
  })
  async store(req: Request, res: Response) {
    const data = await OrderService.getInstance().store(req, res);
    // res.render("order/success");
  }

  @Post("/pay/:id", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async pay(req: Request, res: Response) {
    try {
      // pay for existing order
      const id = req.params.id;
      const data = await OrderService.getInstance().pay({
        orderID: id,
        signedCookies: req.signedCookies,
        req,
        res,
      });
    } catch (error) {
      res.redirect("/error");
    }
  }

  @Post("/cancel/:id", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async orderCancel(req: Request, res: Response) {
    //
    const id = req.params.id;
    await OrderService.getInstance().update({
      Id: id,
      SignedCookies: req.signedCookies,
      status: "order_cancelled",
    });

    res.redirect(fullUrl);
  }

  @Get("/:id", {
    middleware: [decorateHtmlResponse("My Order"), authorization()],
  })
  async show(req: Request, res: Response) {
    //
    let id = req.params.id;
    const data = await OrderService.getInstance().show({
      Id: id,
      SignedCookies: req.signedCookies,
    });
    res.render("order/myOrderDetails", { order: data });
  }
}
