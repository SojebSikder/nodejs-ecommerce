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
  public async index() {}

  async createStore({ name, email, description, phone, signedCookies }) {
    const user = Auth.userByCookie(signedCookies);
    const result = await prisma.store.create({
      data: {
        userId: user.userId,
        StoreDetails: {
          create: {
            name: name,
            email: email,
            description: description,
            phone: phone,
          },
        },
      },
    });

    // return result;
  }
}
