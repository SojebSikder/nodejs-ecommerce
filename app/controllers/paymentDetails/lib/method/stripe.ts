import { IMethod } from "./IMethod";
import Stripe from "stripe";
import { env } from "../../../../../system/src/util";

export class StripeMethod implements IMethod {
  //
  private stripe: Stripe;
  private customer: Stripe.Customer;
  private data;
  private orderId;
  private redirect_urls;

  init(): void {
    this.stripe = new Stripe(env("STRIPE_SECRET_KEY"), {
      apiVersion: "2020-08-27",
    });
  }

  setData(data: any): void {
    this.data = data;
  }

  async store({ TotalPrice, orderID, items, redirect_callback }) {
    //
    const params: Stripe.CustomerCreateParams = {};

    this.customer = await this.stripe.customers.create(params);
    this.orderId = orderID;

    this.redirect_urls = {
      return_url: `${env(
        "APP_URL"
      )}/order/success?pm=stripe&amount=${TotalPrice}&orderID=${this.orderId}`,
      cancel_url: `${env("APP_URL")}/order/cancel?orderID=${this.orderId}`,
    };

    const session = await this.stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: this.redirect_urls.return_url,
      cancel_url: this.redirect_urls.cancel_url,
    });

    redirect_callback(session.url);
  }

  async success({ price, success_callback, PayerID, PaymentID }) {
    //
    this.redirect_urls = {
      return_url: `${env(
        "APP_URL"
      )}/order/success?pm=stripe&amount=${price}&orderID=${this.orderId}`,
      cancel_url: `${env("APP_URL")}/order/cancel?orderID=${this.orderId}`,
    };
    success_callback(this.redirect_urls.return_url);
  }
}
