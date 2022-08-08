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

  async showCategory() {
    const result = await prisma.category.findMany({
      orderBy: {
        parentId: "asc",
      },
    });

    // Example data from the question
    var nodes = result;
    // var nodes = [
    //   { id: 1, parent: 0 },
    //   { id: 2, parent: 0 },
    //   { id: 3, parent: 1 },
    //   { id: 4, parent: 1 },
    //   { id: 5, parent: 2 },
    //   { id: 6, parent: 2 },
    //   { id: 7, parent: 2 },
    //   { id: 30, parent: 3 },
    //   { id: 31, parent: 3 },
    //   { id: 70, parent: 7 },
    //   { id: 71, parent: 7 },
    // ];

    // We construct `t`, the array of parents, so that `t[i] === x` means that `x`
    // is the parent of `i`
    var t = [];
    for (var i = 0; i < nodes.length; i++) {
      // t[nodes[i].id] = nodes[i].parent;
      t[nodes[i].id] = nodes[i].parentId;
    }

    // `t` represents the array of parents
    // `c` represents the parent whose children should be put in the outputted array
    function f(t, c) {
      // The output structure
      var a = [];

      // We loop through all the nodes to fill `a`
      for (var i = 0; i < t.length; i++) {
        // If the node has the parent `c`
        if (t[i] === c) {
          // Create an object with the `id` and `sub` properties and push it
          // to the `a` array
          a.push({
            id: i,
            // The `sub` property's value is generated recursively
            sub: f(t, i),
          });
        }
      }

      // Finish by returning the `a` array
      return a;
    }

    // Print the outputted array in a pretty way
    // We call the `f` function with the 0 parameter because 0 is the parent of the
    // nodes that should be directly put in the returned array
    var util = require("util");
    console.log(
      util.inspect(f(t, 0), {
        colors: true,
        depth: null,
      })
    );

    return result;
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
   * search data
   */
  public async search({ searchText = "" }) {
    let paginationResult;

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
