import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../system/core";
import { StoreService } from "../store/store.service";

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
  public async index({ page = 1, isSearch = false, searchText = "" }) {
    let paginationResult;
    if (isSearch == true) {
      paginationResult = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchText } },
            { description: { contains: searchText } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      paginationResult = await prisma.product.findMany({
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
      result = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchText } },
            { description: { contains: searchText } },
          ],
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip: limit * (page - 1),
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          ProductImage: true,
          store: {
            include: {
              StoreDetails: true,
            },
          },
        },
      });
    } else {
      result = await prisma.product.findMany({
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        skip: limit * (page - 1),
        take: limit,
        // include: {
        //   ProductImage: true,
        //   store: true,
        // },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          ProductImage: true,
          store: {
            include: {
              StoreDetails: true,
            },
          },
        },
      });
    }

    return { data: result, pagination: pagination };
  }

  /**
   * show all data for store owner
   */
  public async showProductForStore({
    page = 1,
    isSearch = false,
    searchText = "",
    signedCookies,
  }) {
    let paginationResult;
    // get store id
    const store = await StoreService.getInstance().index({ signedCookies });
    if (isSearch == true) {
      paginationResult = await prisma.product.findMany({
        where: {
          AND: [
            { storeId: store.id },
            {
              OR: [
                { name: { contains: searchText } },
                { description: { contains: searchText } },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      paginationResult = await prisma.product.findMany({
        where: {
          storeId: store.id,
        },
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
      result = await prisma.product.findMany({
        where: {
          AND: [
            { storeId: store.id },
            {
              OR: [
                { name: { contains: searchText } },
                { description: { contains: searchText } },
              ],
            },
          ],
        },
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
    } else {
      result = await prisma.product.findMany({
        where: {
          storeId: store.id,
        },
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
    }

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
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        ProductImage: true,
        store: {
          include: {
            StoreDetails: true,
          },
        },
      },
    });
    return result;
  }

  /**
   * show specific data for editing
   */
  async edit({ Id, signedCookies }) {
    const id = Id;
    const store = await StoreService.getInstance().index({ signedCookies });
    const result = await prisma.product.findFirst({
      where: {
        id: Number(id),
        storeId: store.id,
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
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const name = req.body.name;
    const description = req.body.description || "";
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);
    const published = req.body.published;
    let publishedValue;

    // check published
    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    // check user
    const user = Auth.userByCookie(req.signedCookies);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // get user store id
    const store = await StoreService.getInstance().index({
      signedCookies: req.signedCookies,
    });

    //
    let data = {
      authorId: user.userid,
      storeId: store.id,
      name: name,
      description: description,
      price: price,
      stock: stock,
      published: publishedValue,
    };
    // check if file is empty or not
    if (file) {
      Object.assign(data, {
        ProductImage: {
          create: {
            url: file,
          },
        },
      });
    }
    // save data
    const result = await prisma.product.create({
      data: data,
    });
  }

  /**
   * update data
   * @param req
   * @param res
   */
  async update(req: Request, res: Response) {
    const file =
      req.files["image"] == null ? "" : req.files["image"][0].filename;
    const id = req.params.id;
    const name = req.body.name || null;
    const description = req.body.description || null;
    const price = Number(req.body.price) || null;
    const stock = Number(req.body.stock) || null;
    const published = req.body.published || null;
    let publishedValue;

    // check published
    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    // check user
    const user = Auth.userByCookie(req.signedCookies);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // get user store id
    const store = await StoreService.getInstance().index({
      signedCookies: req.signedCookies,
    });

    //
    let data = {};
    if (name) {
      Object.assign(data, { name });
    }
    if (description) {
      Object.assign(data, { description });
    }
    if (price) {
      Object.assign(data, { price });
    }
    if (stock) {
      Object.assign(data, { stock });
    }
    if (publishedValue) {
      Object.assign(data, { published: publishedValue });
    }
    // check if file is empty or not
    if (file) {
      Object.assign(data, {
        ProductImage: {
          create: {
            url: file,
          },
        },
      });
    }
    // save data
    const result = await prisma.product.updateMany({
      where: {
        AND: [
          {
            id: Number(id),
          },
          { authorId: user.userid },
          { storeId: store.id },
        ],
      },
      data: data,
    });

    return result;
  }

  /**
   * delete data
   */
  async delete({ Id, signedCookies }) {
    const id = Id;

    // check user
    const user = Auth.userByCookie(signedCookies);

    // get user store id
    const store = await StoreService.getInstance().index({
      signedCookies: signedCookies,
    });

    // delete data
    const result = await prisma.product.deleteMany({
      where: {
        AND: [
          {
            id: Number(id),
          },
          { authorId: user.userid },
          {
            storeId: store.id,
          },
        ],
      },
    });

    return result;
  }
}
