import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../system/core";
import paypal from "paypal-rest-sdk";
import { env } from "../../../system";

const prisma = new PrismaClient();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: env("PAYPAL_CLIENT_ID"),
  client_secret: env("PAYPAL_CLIENT_SECRET"),
});

export class PaymentDetailsService {
  private static _instance: PaymentDetailsService;
  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async store({ redirect_callback }) {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Redhock Bar Soap",
                sku: "001",
                price: "25.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "25.00",
          },
          description: "Washing Bar soap",
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
            // res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }

  async success({ success_callback, PayerID, PaymentID }) {
    const payerId = PayerID;
    const paymentId = PaymentID;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "25.00",
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
          console.log(JSON.stringify(payment));
          // res.send("Success");
          success_callback();
        }
      }
    );
  }
}
