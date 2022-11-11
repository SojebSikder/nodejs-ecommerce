import { Module } from "../../system/src/core/decorator";
import { AdminDashboardController } from "./admin/adminDashboard/adminDashboard.controller";
import { AdminCategoryController } from "./admin/adminProduct/adminCategory/adminCategory.controller";
import { AdminProductController } from "./admin/adminProduct/product.controller";
import { AdminShopController } from "./admin/adminShop/adminShop.controller";
import { CartController } from "./cart/cart.controller";
import { CategoryController } from "./category/category.controller";
import { InvoiceController } from "./invoice/invoice.controller";
import { OrderController } from "./order/order.controller";
import { ProductController } from "./product/product.controller";
import { RecoverPasswordController } from "./recoverPassword/recoverPassword.controller";
import { SellerAuthController } from "./seller/sellerAuth/sellerAuth.controller";
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
    InvoiceController,
    ShopController,
    CategoryController,
    RecoverPasswordController,
    // end app imports
    // seller imports
    SellerAuthController,
    SellerDashboardController,
    SellerProductController,
    SellerOrderController,
    SellerShopController,
    // end seller imports
    // admin
    AdminDashboardController,
    AdminProductController,
    AdminCategoryController,
    AdminShopController,
    // end admin imports
  ],
})
export class AppModule {}
