export interface IMethod {
  init(): void;
  store({ TotalPrice, orderID, items, redirect_callback });
  success({ price, success_callback, PayerID, PaymentID });
}
