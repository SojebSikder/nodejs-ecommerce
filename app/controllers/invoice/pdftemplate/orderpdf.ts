import { env } from "../../../../system/src/util";

export const orderpdf = ({
  totalPrice,
  customerName,
  orderId,
  orderStatus,
  items,
  paymentStatus,
}) => {
  const today = new Date();
  return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title"><img  src="${env(
                              "APP_URL"
                            )}/assets/images/logo.png"
                               style="width:100%; max-width:156px;"></td>
                            <td>
                               Date: ${`${today.getDate()}. ${
                                 today.getMonth() + 1
                               }. ${today.getFullYear()}.`}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                               Customer name: ${customerName}
                            </td>
                            <td>
                               Order Id: ${orderId}
                            </td>
                            <td>
                               Order Status: ${orderStatus}
                            </td>
                            <td>
                               Payment Status: ${paymentStatus}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="heading">
                   <td>Bought items</td>
                   <td>Shop name</td>
                   <td>Price</td>
                   <td>Quantity</td>
                   <td>Status</td>
                </tr>
                ${items.map((item) => {
                  return `
                    <tr class="item">
                       <td>${item.product.name}</td>
                       <td>${item.product.shop.ShopDetails[0].displayName}</td>
                       <td>${item.price}</td>
                       <td>${item.quantity}</td>
                       <td></td>
                    </tr>
                  `;
                })}
             </table>
             <br />
             <h1 class="justify-center">Total price: $${totalPrice}</h1>
             <p>Generated from <a href="${env("APP_URL")}">${env(
    "APP_NAME"
  )}</a></p>
          </div>
       </body>
    </html>
    `;
};
