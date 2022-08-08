import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminShopService {
  private static _instance: AdminShopService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  create(data: any) {
    return "This action adds a new user";
  }

  async findAll() {
    const result = await prisma.shop.findMany({
      include: {
        ShopDetails: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return result;
  }

  async findOne(id) {
    const _id = Number(id);
    const result = await prisma.shop.findFirst({
      where: {
        id: _id,
      },
      include: {
        ShopDetails: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
    return result;
  }

  async update(id, { status = null }) {
    const _id = Number(id);

    let result;
    let data = {};
    let statusCode = 200;
    let message = "";
    let success = true;

    if (status == "delete") {
      result = await prisma.shopDetails.deleteMany({
        where: {
          shopId: _id,
        },
      });

      result = await prisma.shop.delete({
        where: {
          id: _id,
        },
      });
      message = "Shop deleted";
    } else {
      if (status) {
        Object.assign(data, { status });
      }

      result = await prisma.shop.update({
        where: {
          id: _id,
        },
        data: data,
      });
    }

    return result;
  }

  async updateShopDetails({
    shopId,
    name = null,
    displayName = null,
    sellerStatus = null,
    email = null,
    description = null,
    phone = null,
    status = null,
  }) {
    let _shopId = shopId;
    let result;
    let data = {};
    let statusCode = 200;
    let message = "";
    let success = true;

    if (displayName) {
      Object.assign(data, { displayName });
    }
    if (sellerStatus) {
      result = await prisma.shop.updateMany({
        where: {
          id: _shopId,
        },
        data: {
          sellerStatus: sellerStatus,
        },
      });
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
        shopId: shopId,
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

  async remove(id) {
    const _id = Number(id);
    const result = await prisma.shop.delete({
      where: {
        id: _id,
      },
    });
    return result;
  }
}
