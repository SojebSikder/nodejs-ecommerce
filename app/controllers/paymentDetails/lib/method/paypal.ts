import paypal from "paypal-rest-sdk";
import { env } from "../../../../../system/src/util";
import { IMethod } from "./IMethod";

export class PaypalMethod implements IMethod {
  init(): void {
    paypal.configure({
      mode: env("PAYPAL_MODE"), //sandbox or live
      client_id: env("PAYPAL_CLIENT_ID"),
      client_secret: env("PAYPAL_CLIENT_SECRET"),
    });
  }
  async store({ TotalPrice, orderID, items, redirect_callback }) {
    const orderid = orderID;
    const totalPrice = TotalPrice;
    const itemsArray = items;
    //
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${env(
          "APP_URL"
        )}/order/success?amount=${totalPrice}&orderID=${orderid}`,
        cancel_url: `${env("APP_URL")}/order/cancel?orderID=${orderid}`,
      },
      transactions: [
        {
          item_list: {
            items: itemsArray,
          },
          amount: {
            currency: "USD",
            total: totalPrice,
          },
          description: "Buy products",
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            redirect_callback(payment.links[i].href);
          }
        }
      }
    });
  }

  async success({ price, success_callback, PayerID, PaymentID }) {
    const payerId = PayerID;
    const paymentId = PaymentID;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            // total: "25.00",
            total: price,
          },
        },
      ],
    };

    // Obtains the transaction details from paypal
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          // console.log(JSON.stringify(payment));
          // res.send("Success");
          success_callback();
        }
      }
    );
  }
}
