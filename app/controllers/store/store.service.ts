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
      result = await prisma.store.update({
        where: {
          userId: user.userid,
        },
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
}
