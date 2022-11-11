import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SellerAuthService {
  private static _instance: SellerAuthService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  login() {
    return "This action returns all user";
  }
}
