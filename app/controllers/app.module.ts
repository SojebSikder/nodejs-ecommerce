import { Module } from "../../system/decorator";
import { IndexController } from "./admin/index/index.controller";
import { CartController } from "./cart/cart.controller";
import { ProductController } from "./product/product.controller";
import { UserController } from "./user/user.controller";

@Module({
  controllers: [
    UserController,
    ProductController,
    CartController,
    IndexController, // Admin/index.controller.ts
  ],
})
export class AppModule {}
