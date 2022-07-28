import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../../system/src";

const prisma = new PrismaClient();

export class SellerShopService {
  private static _instance: SellerShopService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  public async index({ signedCookies, status = null }) {
    const user = Auth.userByCookie(signedCookies);

    const result = await prisma.shop.findFirst({
      where: {
        AND: [
          {
            userId: user.userid,
          },
          status != null ? { status: status } : {},
        ],
      },
      include: {
        ShopDetails: true,
      },
    });
    return result;
  }

  async updateShop({ status = null, signedCookies }) {
    const user = Auth.userByCookie(signedCookies);
    let result;
    let data = {};
    let statusCode = 200;
    let message = "";
    let success = true;

    if (status == "delete") {
      const ShopInfo = await prisma.shop.findFirst({
        where: {
          userId: user.userid,
        },
      });

      result = await prisma.shopDetails.deleteMany({
        where: {
          shopId: ShopInfo.id,
        },
      });

      result = await prisma.shop.delete({
        where: {
          userId: user.userid,
        },
      });
      message = "Shop deleted";
    } else {
      if (status) {
        Object.assign(data, { status });
      }

      result = await prisma.shop.updateMany({
        where: {
          userId: user.userid,
        },
        data: data,
      });
    }
    return {
      statusCode: statusCode,
      success: success,
      data: result,
      message: message,
    };
  }

  //
  async updateShopDetails({
    name = null,
    displayName = null,
    email = null,
    description = null,
    phone = null,
    status = null,
    signedCookies,
  }) {
    const user = Auth.userByCookie(signedCookies);
    let result;
    let data = {};
    let statusCode = 200;
    let message = "";
    let success = true;

    const ShopInfo = await this.index({ signedCookies: signedCookies });

    if (displayName) {
      Object.assign(data, { displayName });
    }
    if (email) {
      Object.assign(data, { email });
    }
    if (description) {
      Object.assign(data, { description });
    }
    if (phone) {
      Object.assign(data, { phone });
    }
    if (status) {
      Object.assign(data, { status });
    }

    if (name) {
      Object.assign(data, { name });
      const checkShopNameExist = await prisma.shopDetails.findFirst({
        where: {
          name: name,
        },
      });

      if (checkShopNameExist) {
        statusCode = 400;
        message = "Shop name already exist";
        success = false;

        return {
          statusCode: statusCode,
          success: success,
          data: result,
          message: message,
        };
      }
    }

    result = await prisma.shopDetails.updateMany({
      where: {
        shopId: ShopInfo.id,
      },
      data: data,
    });

    return {
      statusCode: statusCode,
      success: success,
      data: result,
      message: message,
    };
  }
}
