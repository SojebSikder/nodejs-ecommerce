import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../system/core";
import { Cart } from "../../models/Cart";

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
      include: {
        product: true,
      },
      where: {
        userId: user.userid,
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

    // const result = await prisma.cart.create({
    //   data: {
    //     productId: _productId,
    //     userId: user.userid,
    //     quantity: _quantity,
    //   },
    // });

    const result = new Cart();
    result.userId = user.userid;
    result.productId = _productId;
    result.quantity = _quantity;
    await result.save();

    return result;
  }
}
