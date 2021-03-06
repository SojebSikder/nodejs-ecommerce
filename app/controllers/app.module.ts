import { Module } from "../../system/decorator";
import { AdminProductController } from "./admin/adminProduct/product.controller";
import { IndexController } from "./admin/index/index.controller";
import { CartController } from "./cart/cart.controller";
import { InvoiceController } from "./invoice/invoice.controller";
import { OrderController } from "./order/order.controller";
import { ProductController } from "./product/product.controller";
import { StoreController } from "./store/store.controller";
import { UserController } from "./user/user.controller";

@Module({
  controllers: [
    UserController,
    ProductController,
    CartController,
    OrderController,
    IndexController,
    InvoiceController,
    StoreController,
    AdminProductController, // Admin/index.controller.ts
  ],
})
export class AppModule {}
