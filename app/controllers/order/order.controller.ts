import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";
import { v4 as uuidv4 } from "uuid";
// import { PaymentDetailsService } from "../paymentDetails/paymentDetails.service";
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
    } else {
      paymentMethods = new PaypalMethod();
    }
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
    // const paymentMethod = req.body.payment_method; // STRIPE, PAYPAL
    // store order
    const data = await OrderService.getInstance().store(req, res);
    // res.render("order/success");
  }

  @Post("/pay/:id", {
    middleware: [decorateHtmlResponse(), authorization()],
  })
  async pay(req: Request, res: Response) {
    // pay for existing order
    const id = req.params.id;
    const data = await OrderService.getInstance().pay({
      orderID: id,
      signedCookies: req.signedCookies,
      req,
      res,
    });
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
    // res.redirect("back");
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
