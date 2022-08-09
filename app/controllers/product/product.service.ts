import { PrismaClient } from "@prisma/client";

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
          shop: {
            include: {
              ShopDetails: true,
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
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          ProductImage: true,
          shop: {
            include: {
              ShopDetails: true,
            },
          },
        },
      });
    }

    return { data: result, pagination: pagination };
  }

  /**
   * show all data
   */
  public async findByCategory({ page = 1, categoryName }) {
    let paginationResult;

    paginationResult = await prisma.product.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let limit = 15;
    let pagination = Math.ceil(paginationResult.length / limit);

    let result;
    // main query

    result = await prisma.product.findMany({
      where: {
        category: {
          name: categoryName,
        },
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
        shop: {
          include: {
            ShopDetails: true,
          },
        },
      },
    });

    return { data: result, pagination: pagination };
  }

  /**
   * search data
   */
  public async search({ searchText = "" }) {
    let paginationResult;

    // for pagination
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

    let limit = 10;
    let pagination = Math.ceil(paginationResult.length / limit);

    let result;
    // main query
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
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        ProductImage: true,
        shop: {
          include: {
            ShopDetails: true,
          },
        },
      },
    });

    return { data: result, pagination: pagination };
  }

  /**
   * show specific data
   */
  async show(id: string) {
    const _id = id;
    const result = await prisma.product.findFirst({
      where: {
        id: Number(_id),
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        ProductImage: true,
        shop: {
          include: {
            ShopDetails: true,
          },
        },
      },
    });
    return result;
  }
}
