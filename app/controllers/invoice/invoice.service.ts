import fs from "fs";
import pdf from "html-pdf";
import { OrderService } from "../order/order.service";
import { orderpdf } from "./pdftemplate/orderpdf";

export class InvoiceService {
  private static _instance: InvoiceService;
  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public async printOrderPdf({ id, signedCookie, endCallback, callback }) {
    const orderResult = await OrderService.getInstance().show({
      Id: id,
      SignedCookies: signedCookie,
    });

    const totalPrice = orderResult.price;
    const orderId = orderResult.orderId;
    const name = orderResult.user.username;
    const paymentStatus = orderResult.paymentStatus;

    const html = orderpdf({
      paymentStatus: paymentStatus,
      orderStatus: orderResult.status,
      totalPrice: totalPrice,
      customerName: name,
      orderId,
      items: orderResult.OrderItem,
    });

    return await this.printPdfBuffer({
      html,
      endCallback,
      callback,
    });
  }

  /**
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   * -
   */
  // -------------Don't scroll down.<--> Abstraction here----------------
  // direct downlaod. send chunk by chunk to user to download direct.
  public async printPdfBuffer({ html, endCallback, callback }) {
    pdf.create(html).toBuffer(function (err, buffer) {
      callback(buffer);
      endCallback();
      // console.log("This is a buffer:", Buffer.isBuffer(buffer));
    });
  }
  // save to file
  public async printPdf({ html }) {
    return pdf.create(html, {}).toFile(`${__dirname}/result.pdf`, (err) => {
      if (err) {
        Promise.reject();
      }
      Promise.resolve();
    });
  }
  // stream to user
  public async printPdfStream({ html }) {
    return pdf.create(html).toStream(function (err, stream) {
      stream.pipe(fs.createWriteStream(`${__dirname}/result.pdf`));
    });
  }
}
