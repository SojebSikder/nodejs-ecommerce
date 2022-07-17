import { Request, Response } from "express";
import { Controller, Get } from "../../../system/decorator";
import { InvoiceService } from "./invoice.service";

@Controller("/invoice/")
export class InvoiceController {
  //
  @Get("order/:id")
  async printOrderPdf(req: Request, res: Response) {
    const id = req.params.id;

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      // "Content-Disposition": `attachment;filename=${__dirname}\\result.pdf`,
    });

    const result = await InvoiceService.getInstance().printOrderPdf({
      id,
      signedCookie: req.signedCookies,
      callback: (buffer) => {
        stream.write(buffer);
      },
      endCallback: () => {
        stream.end();
      },
    });
  }
}
