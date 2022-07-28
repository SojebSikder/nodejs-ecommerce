import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../system/src/core";

const prisma = new PrismaClient();

export class ShopService {
  private static _instance: ShopService;
  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  /**
   * show all data
   */
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

  /**
   * show all data
   */
  public async findAll({
    page = 1,
    isSearch = false,
    searchText = "",
    status = "approved",
    sellerStatus = "active",
  }) {
    let paginationResult;
    if (isSearch == true) {
      paginationResult = await prisma.shop.findMany({
        where: {
          OR: [
            {
              ShopDetails: {
                every: {
                  name: { contains: searchText },
                },
              },
            },
            {
              ShopDetails: {
                every: {
                  description: { contains: searchText },
                },
              },
            },
            // status != null ? { status: status } : {},
            // sellerStatus != null ? { sellerStatus: sellerStatus } : {},
          ],

          status: status,
          sellerStatus: sellerStatus,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      paginationResult = await prisma.shop.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let limit = 15;
    let pagination = Math.ceil(paginationResult.length / limit);

    let result;
    // main query
    if (isSearch == true) {
      result = await prisma.shop.findMany({
        where: {
          OR: [
            {
              ShopDetails: {
                every: {
                  name: { contains: searchText },
                },
              },
            },
            {
              ShopDetails: {
                every: {
                  description: { contains: searchText },
                },
              },
            },
            // status != null ? { status: status } : {},
            // sellerStatus != null ? { sellerStatus: sellerStatus } : {},
          ],

          status: status,
          sellerStatus: sellerStatus,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip: limit * (page - 1),
        take: limit,
        include: {
          ShopDetails: true,
        },
      });
    } else {
      result = await prisma.shop.findMany({
        where: {
          status: status,
          sellerStatus: sellerStatus,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip: limit * (page - 1),
        take: limit,
        include: {
          ShopDetails: true,
        },
      });
    }
    return { data: result, pagination: pagination };
  }

  /**
   * show one data
   */
  public async findOne({
    name,
    signedCookies,
    status = "approved",
    sellerStatus = "active",
  }) {
    const user = Auth.userByCookie(signedCookies);

    const result = await prisma.shop.findFirst({
      where: {
        AND: [
          {
            ShopDetails: {
              every: {
                name: name,
              },
            },
          },
          status != null ? { status: status } : {},
          sellerStatus != null ? { sellerStatus: sellerStatus } : {},
        ],
      },
      include: {
        ShopDetails: true,
      },
    });
    return result;
  }

  async createShop({
    name,
    displayName,
    email,
    description,
    phone,
    signedCookies,
  }) {
    const user = Auth.userByCookie(signedCookies);

    const checkShopNameExist = await prisma.shopDetails.findFirst({
      where: {
        name: name,
      },
    });

    let result;
    let statusCode = 200;
    let message = "";
    let success = true;

    if (checkShopNameExist) {
      statusCode = 400;
      message = "Shop name already exist";
      success = false;
    } else {
      result = await prisma.shop.create({
        data: {
          userId: user.userid,
          ShopDetails: {
            create: {
              name: name,
              displayName: displayName,
              email: email,
              description: description,
              phone: phone,
            },
          },
        },
      });
    }

    return {
      statusCode: statusCode,
      success: success,
      data: result,
      message: message,
    };
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

    const ShopInfo = await prisma.shop.findFirst({
      where: {
        userId: user.userid,
      },
    });

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
