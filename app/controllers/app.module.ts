import { Module } from "../../system/src/core/decorator";
import { AdminCategoryController } from "./admin/adminProduct/adminCategory/adminCategory.controller";
import { AdminProductController } from "./admin/adminProduct/product.controller";
import { IndexController } from "./admin/index/index.controller";
import { CartController } from "./cart/cart.controller";
import { InvoiceController } from "./invoice/invoice.controller";
import { OrderController } from "./order/order.controller";
import { ProductController } from "./product/product.controller";
import { RecoverPasswordController } from "./recoverPassword/recoverPassword.controller";
import { SellerDashboardController } from "./seller/sellerDashboard/sellerDashboard.controller";
import { SellerOrderController } from "./seller/sellerOrder/sellerOrder.controller";
import { SellerProductController } from "./seller/sellerProduct/sellerProduct.controller";
import { SellerShopController } from "./seller/sellerShop/sellerShop.controller";
import { ShopController } from "./shop/shop.controller";
import { UserController } from "./user/user.controller";

@Module({
  controllers: [
    // app imports
    UserController,
    ProductController,
    CartController,
    OrderController,
    IndexController,
    InvoiceController,
    ShopController,
    RecoverPasswordController,
    // end app imports
    // seller imports
    SellerDashboardController,
    SellerProductController,
    SellerOrderController,
    SellerShopController,
    // end seller imports
    // admin
    AdminProductController,
    AdminCategoryController,
    // end admin imports
  ],
})
export class AppModule {}
