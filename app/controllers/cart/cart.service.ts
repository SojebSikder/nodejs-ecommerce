import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class CartService {
  private static _instance: CartService;

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
  public async index(signedCookies) {
    const user = Auth.userByCookie(signedCookies);

    const result = await prisma.cart.findMany({
      orderBy: [
        {
          id: "desc",
        },
      ],
      select: {
        id: true,
        userId: true,
        productId: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            brand: true,
            description: true,
            keywords: true,
            ProductImage: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },

      where: {
        userId: user.userid,
      },
    });

    return result;
  }

  /**
   * delete specific data
   * @param req
   * @param res
   */
  async delete(id: string) {
    const _id = id;
    const result = await prisma.cart.delete({
      where: {
        id: Number(_id),
      },
    });
    return result;
  }
  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(id: string) {
    const _id = id;
    const result = await prisma.cart.findFirst({
      where: {
        id: Number(_id),
      },
    });
    return result;
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store({
    productId,
    quantity,
    signedCookies,
  }: {
    productId: number;
    quantity: number;
    signedCookies: any;
  }) {
    const _productId = productId;
    const _quantity = quantity;

    const user = Auth.userByCookie(signedCookies);
    let result;

    // if exist then update qnty just
    const cartExists = await prisma.cart.findFirst({
      where: {
        AND: [
          {
            productId: Number(_productId),
          },
          {
            userId: user.userid,
          },
        ],
      },
    });

    if (cartExists) {
      result = await prisma.cart.update({
        where: {
          id: cartExists.id,
        },
        data: {
          quantity: Number(cartExists.quantity) + Number(_quantity),
        },
      });
    } else {
      result = await prisma.cart.create({
        data: {
          productId: Number(_productId),
          userId: Number(user.userid),
          quantity: Number(_quantity),
        },
      });
    }

    return result;
  }
}
