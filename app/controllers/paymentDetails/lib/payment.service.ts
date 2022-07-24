import { IMethod } from "./method/IMethod";

/**
 * @class PaymentService
 * @implements IMethod
 * @description
 * This class is used to handle the payment process.
 * @author sojebsikder<sojebsikder@gmail.com>
 */
export class PaymentService implements IMethod {
  constructor(private paymentMethod: IMethod) {}

  init(): void {
    return this.paymentMethod.init();
  }

  async store({ TotalPrice, orderID, items, redirect_callback }) {
    return this.paymentMethod.store({
      TotalPrice,
      orderID,
      items,
      redirect_callback,
    });
  }

  async success({ price, success_callback, PayerID, PaymentID }) {
    return this.paymentMethod.success({
      price,
      success_callback,
      PayerID,
      PaymentID,
    });
  }
}
