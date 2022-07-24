import { IMethod } from "./IMethod";
import Stripe from "stripe";
import { env } from "../../../../../system";

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

  async store({
    TotalPrice,
    orderID,
    items,
    redirect_callback,
  }: {
    TotalPrice: any;
    orderID: any;
    items: any;
    redirect_callback: any;
  }) {
    //
    const params: Stripe.CustomerCreateParams = {
      // email: req.body.stripeEmail,
      // source: req.body.stripeToken,
      // email: this.data.stripeEmail,
      // source: this.data.stripeToken,
      // name: "Gourav Hammad",
      // address: {
      //   line1: "TC 9/4 Old MES colony",
      //   postal_code: "452331",
      //   city: "Indore",
      //   state: "Madhya Pradesh",
      //   country: "India",
      // },
    };

    this.customer = await this.stripe.customers.create(params);
    this.orderId = orderID;

    this.redirect_urls = {
      return_url: `${env(
        "APP_URL"
      )}/order/success?pm=stripe&amount=${TotalPrice}&orderID=${this.orderId}`,
      cancel_url: `${env("APP_URL")}/order/cancel?orderID=${this.orderId}`,
    };

    return await this.stripe.paymentIntents
      .create({
        payment_method:"pm_card_visa",
        payment_method_types: ["card"],
        customer: this.customer.id,
        setup_future_usage: "off_session",
        amount: TotalPrice,
        currency: "USD",
        // automatic_payment_methods: {
        //   enabled: true,
        // },
      })
      .then((paymentIntent) => {
        redirect_callback(this.redirect_urls.return_url);
      });
  }

  async success({
    price,
    success_callback,
    PayerID,
    PaymentID,
  }: {
    price: any;
    success_callback: any;
    PayerID: any;
    PaymentID: any;
  }): Promise<void> {
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
