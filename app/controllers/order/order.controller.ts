import { Request, Response } from "express";
import { Controller, Get, Post } from "../../../system/decorator";
import { authorization } from "../../middlewares/authorization";
import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";
import { CartService } from "../cart/cart.service";
import { OrderService } from "./order.service";
import { v4 as uuidv4 } from "uuid";
import { PaymentDetailsService } from "../paymentDetails/paymentDetails.service";

@Controller("/order")
export class OrderController {
  //
  @Get("", { middleware: [decorateHtmlResponse("My Order"), authorization()] })
  async index(req: Request, res: Response) {
    //
    const data = await OrderService.getInstance().index(req.signedCookies);
    res.render("order/myOrder", { orders: data });
  }

  @Get("/:id", {
    middleware: [decorateHtmlResponse("My Order"), authorization()],
  })
  async show(req: Request, res: Response) {
    //
    let id = req.params.id;
    const data = await OrderService.getInstance().show(id);
    res.render("order/myOrderDetails", { order: data });
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
    await PaymentDetailsService.getInstance().success({
      price: req.query.amount,
      PayerID: req.query.PayerID,
      PaymentID: req.query.paymentId,
      success_callback: () => {
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
    // store order
    const data = await OrderService.getInstance().store(req, res);
    // res.render("order/success");
  }

  // @Post("/product_item", {
  //   middleware: [decorateHtmlResponse("My Order"), authorization()],
  // })
  // async storeOrderProductItem(req: Request, res: Response) {
  //   const data = await OrderService.getInstance().storeOrderProductItem({
  //     OrderItemId: req.body.OrderItemId,
  //     signedCookies: req.signedCookies,
  //   });
  //   res.send("Order placed successfully");
  // }
}
