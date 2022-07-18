import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Product } from "../../models/Product";
import { Auth } from "../../../system/core";

const prisma = new PrismaClient();

export class ProductService {
  private static _instance: ProductService;
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
  public async index({ page = 1 }) {
    const paginationResult = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    let limit = 15;
    let pagination = Math.ceil(paginationResult.length / limit);

    const result = await prisma.product.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      skip: limit * (page - 1),
      take: limit,
      include: {
        ProductImage: true,
      },
    });
    return { data: result, pagination: pagination };
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(arg_id: string) {
    const id = arg_id;
    const result = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        ProductImage: true,
      },
    });
    return result;
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store(req: Request, res: Response) {
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const published = req.body.published;
    let publishedValue;

    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    const user = Auth.userByCookie(req.signedCookies);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const result = await prisma.product.create({
      data: {
        authorId: user.userid,
        name: name,
        description: description,
        price: price,
        stock: stock,
        published: publishedValue,
      },
    });
  }
}
