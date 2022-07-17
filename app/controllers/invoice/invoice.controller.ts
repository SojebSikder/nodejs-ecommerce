import { Request, Response } from "express";
import { Controller, Get } from "../../../system/decorator";
import { InvoiceService } from "./invoice.service";

@Controller("/invoice/")
export class InvoiceController {
  //
  @Get("order")
  async printOrderPdf(req: Request, res: Response) {
    const { name, price1, price2, receiptId } = req.body;

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      // "Content-Disposition": `attachment;filename=${__dirname}\\result.pdf`,
    });

    const result = await InvoiceService.getInstance().printOrderPdf({
      callback: (buffer) => {
        stream.write(buffer);
      },
      endCallback: () => {
        stream.end();
      },
      name,
      price1,
      price2,
      receiptId,
    });
  }
}
