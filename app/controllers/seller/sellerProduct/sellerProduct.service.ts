import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../../system/src";
import { ShopService } from "../../shop/shop.service";

const prisma = new PrismaClient();

export class SellerProductService {
  private static _instance: SellerProductService;

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
   * show all data for store owner
   */
  public async findAll({
    page = 1,
    isSearch = false,
    searchText = "",
    signedCookies,
    domain,
  }) {
    let paginationResult;
    // get store id
    const shop = await ShopService.getInstance().index({
      domain: domain,
      signedCookies,
    });
    if (isSearch == true) {
      paginationResult = await prisma.product.findMany({
        where: {
          AND: [
            { shopId: shop.id },
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
          shopId: shop.id,
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
            { shopId: shop.id },
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
          shopId: shop.id,
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

  async getCategory() {
    const result = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return result;
  }

  async create({
    productName,
    productDescription,
    Price,
    Stock,
    Published,
    categoryId,
    image,
    signedCookies,
    domain,
  }) {
    const file = image;
    const name = productName;
    const description = productDescription || "";
    const price = Number(Price);
    const stock = Number(Stock);
    const published = Published;
    const _categoryId = Number(categoryId);
    let publishedValue;

    // check published
    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    // check user
    const user = Auth.userByCookie(signedCookies);
    if (!user) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    // get user shop id
    const shop = await ShopService.getInstance().index({
      signedCookies: signedCookies,
      domain: domain,
    });

    //
    let data = {
      authorId: user.userid,
      shopId: shop.id,
      name: name,
      description: description,
      price: price,
      quantity: stock,
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
    if (categoryId) {
      Object.assign(data, {
        categoryId: _categoryId,
      });
    }
    // save data
    const result = await prisma.product.create({
      data: data,
    });
    return result;
  }

  findOne(id: string) {
    return "This action returns a {id} user";
  }

  /**
   * show specific data for editing
   */
  async edit({ domain, Id, signedCookies }) {
    const id = Id;
    const store = await ShopService.getInstance().index({
      domain: domain,
      signedCookies,
    });
    const result = await prisma.product.findFirst({
      where: {
        AND: [
          {
            id: Number(id),
          },
          {
            shopId: store.id,
          },
        ],
      },
      include: {
        ProductImage: true,
      },
    });
    return result;
  }

  async update(
    Id,
    {
      productName,
      productDescription,
      Price,
      Stock,
      categoryId,
      Published,
      image,
      signedCookies,
      domain,
    }
  ) {
    const file = image;
    const id = Id;
    const name = productName;
    const description = productDescription;
    const price = Number(Price) || null;
    const stock = Number(Stock) || null;
    const _categoryId = Number(categoryId);
    const published = Published || null;
    let publishedValue;

    // check published
    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    // check user
    const user = Auth.userByCookie(signedCookies);
    if (!user) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    // get user store id
    const shop = await ShopService.getInstance().index({
      signedCookies: signedCookies,
      domain: domain,
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
      Object.assign(data, { quantity: stock });
    }
    if (_categoryId) {
      Object.assign(data, { categoryId: _categoryId });
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
          { shopId: shop.id },
        ],
      },
      data: data,
    });

    return result;
  }

  /**
   * delete data
   */
  async remove(Id, { domain, signedCookies }) {
    const id = Id;

    // check user
    const user = Auth.userByCookie(signedCookies);

    // get user store id
    const shop = await ShopService.getInstance().index({
      signedCookies: signedCookies,
      domain: domain,
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
            shopId: shop.id,
          },
        ],
      },
    });

    return result;
  }
}
