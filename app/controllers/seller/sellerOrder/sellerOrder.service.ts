import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../../system/src";

const prisma = new PrismaClient();

export class SellerOrderService {
  private static _instance: SellerOrderService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async findAll({ signedCookies }) {
    //
    const user = Auth.userByCookie(signedCookies);
    const result = await prisma.subOrder.findMany({
      where: {
        sellerId: user.userid,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return result;
  }

  async findOne(id: string, { signedCookies }) {
    //
    const user = Auth.userByCookie(signedCookies);
    const items = await prisma.subOrder.findFirst({
      where: {
        AND: [
          {
            orderId: id,
          },
          {
            sellerId: user.userid,
          },
        ],
      },
      select: {
        id: true,
        orderId: true,
        status: true,
        SubOrderItem: {
          select: {
            subOrderId: true,
            quantity: true,
            price: true,
            product: true,
          },
        },
      },
    });
    return items;
  }

  async markOrder(id: string, { status, signedCookies }) {
    //
    const user = Auth.userByCookie(signedCookies);
    const result = await prisma.subOrder.updateMany({
      where: {
        AND: [
          {
            orderId: id,
          },
          {
            sellerId: user.userid,
          },
        ],
      },
      data: {
        status: status,
      },
    });

    return result;
  }
}
