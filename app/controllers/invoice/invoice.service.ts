import fs from "fs";
import pdf from "html-pdf";
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

  public async printOrderPdf({
    endCallback,
    callback,
    name,
    price1,
    price2,
    receiptId,
  }) {
    return await this.printPdfBuffer({
      endCallback,
      callback,
      name,
      price1,
      price2,
      receiptId,
    });
  }

  // -------------Don't scroll down.<--> Abstraction here----------------
  // direct downlaod. send chunk by chunk to user to download direct.
  public async printPdfBuffer({
    endCallback,
    callback,
    name,
    price1,
    price2,
    receiptId,
  }) {
    pdf
      .create(orderpdf({ name, price1, price2, receiptId }))
      .toBuffer(function (err, buffer) {
        callback(buffer);
        endCallback();
        // console.log("This is a buffer:", Buffer.isBuffer(buffer));
      });
  }
  // save to file
  public async printPdf({ name, price1, price2, receiptId }) {
    return pdf
      .create(orderpdf({ name, price1, price2, receiptId }), {})
      .toFile(`${__dirname}/result.pdf`, (err) => {
        if (err) {
          Promise.reject();
        }

        Promise.resolve();
      });
  }
  // stream to user
  public async printPdfStream({
    endCallback,
    callback,
    name,
    price1,
    price2,
    receiptId,
  }) {
    return pdf
      .create(orderpdf({ name, price1, price2, receiptId }))
      .toStream(function (err, stream) {
        stream.pipe(fs.createWriteStream(`${__dirname}/result.pdf`));
      });
  }
}
