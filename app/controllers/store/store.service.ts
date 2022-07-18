import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class StoreService {
  private static _instance: StoreService;
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
  public async index({ signedCookies }) {
    const user = Auth.userByCookie(signedCookies);
    const result = await prisma.store.findFirst({
      where: {
        userId: user.userid,
      },
      include: {
        StoreDetails: true,
      },
    });
    return result;
  }

  async createStore({
    name,
    displayName,
    email,
    description,
    phone,
    signedCookies,
  }) {
    const user = Auth.userByCookie(signedCookies);

    const checkStoreNameExist = await prisma.storeDetails.findFirst({
      where: {
        name: name,
      },
    });

    let result;
    let statusCode = 200;
    let message = "";
    let success = true;

    if (checkStoreNameExist) {
      statusCode = 400;
      message = "Store name already exist";
      success = false;
    } else {
      result = await prisma.store.create({
        data: {
          userId: user.userid,
          StoreDetails: {
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
  async updateStore({
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

    const storeInfo = await prisma.store.findFirst({
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
      const checkStoreNameExist = await prisma.storeDetails.findFirst({
        where: {
          name: name,
        },
      });

      if (checkStoreNameExist) {
        statusCode = 400;
        message = "Store name already exist";
        success = false;

        return {
          statusCode: statusCode,
          success: success,
          data: result,
          message: message,
        };
      }
    }

    result = await prisma.storeDetails.updateMany({
      where: {
        storeId: storeInfo.id,
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
