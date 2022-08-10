import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminCategoryService {
  private static _instance: AdminCategoryService;

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

    // // Example data from the question
    // var nodes = result;
    // // We construct `t`, the array of parents, so that `t[i] === x` means that `x`
    // // is the parent of `i`
    // var t = [];
    // for (var i = 0; i < nodes.length; i++) {
    //   // t[nodes[i].id] = nodes[i].parentId;
    //   // t[nodes[i].id] = { parentId: nodes[i].parentId, data: nodes[i] };
    //   t[nodes[i].id] = { parentId: nodes[i].parentId, ...nodes[i] };
    // }

    // // `t` represents the array of parents
    // // `c` represents the parent whose children should be put in the outputted array
    // function f(t, c) {
    //   // The output structure
    //   var a = [];

    //   // We loop through all the nodes to fill `a`
    //   for (var i = 0; i < t.length; i++) {
    //     // If the node has the parent `c`
    //     // if (t[i] === c) {
    //     if (t[i] != undefined) {
    //       if (t[i].parentId === c) {
    //         // Create an object with the `id` and `sub` properties and push it
    //         // to the `a` array
    //         a.push({
    //           id: i,
    //           data: t[i],
    //           // The `sub` property's value is generated recursively
    //           sub: f(t, i),
    //         });
    //       }
    //     }
    //   }

    //   // Finish by returning the `a` array
    //   return a;
    // }

    // // Print the outputted array in a pretty way
    // // We call the `f` function with the 0 parameter because 0 is the parent of the
    // // nodes that should be directly put in the returned array
    // var util = require("util");
    // console.log(
    //   util.inspect(f(t, 0), {
    //     colors: true,
    //     depth: null,
    //   })
    // );

    // return f(t, 0);

    return result;
  }

  async create({ name, parentId, published }) {
    const _name = name;
    const _parentId = Number(parentId == null ? 0 : parentId);
    const _slug = _name.replace(/\s+/g, "-").toLowerCase();
    let publishedValue;

    // check published
    if (published) {
      publishedValue = true;
    } else {
      publishedValue = false;
    }

    const result = await prisma.category.create({
      data: {
        name: _name,
        parentId: _parentId,
        slug: _slug,
        published: publishedValue,
      },
    });
    return result;
  }

  async findAll() {
    const result = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return result;
  }

  async findOne(id) {
    const _id = Number(id);
    const result = await prisma.category.findFirst({
      where: {
        id: _id,
      },
    });
    return result;
  }

  async update(id: string, { name }) {
    const _id = Number(id);
    const _name = name;
    const _slug = _name.replace(/\s+/g, "-").toLowerCase();
    const result = await prisma.category.update({
      where: {
        id: _id,
      },
      data: {
        name: _name,
        slug: _slug,
      },
    });
    return result;
  }

  async remove(id) {
    const result = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    return result;
  }
}

// async showCategory() {
//   const result = await prisma.category.findMany({
//     orderBy: {
//       parentId: "asc",
//     },
//   });

//   // Example data from the question
//   var nodes = result;
//   // var nodes = [
//   //   { id: 1, parent: 0 },
//   //   { id: 2, parent: 0 },
//   //   { id: 3, parent: 1 },
//   //   { id: 4, parent: 1 },
//   //   { id: 5, parent: 2 },
//   //   { id: 6, parent: 2 },
//   //   { id: 7, parent: 2 },
//   //   { id: 30, parent: 3 },
//   //   { id: 31, parent: 3 },
//   //   { id: 70, parent: 7 },
//   //   { id: 71, parent: 7 },
//   // ];

//   // We construct `t`, the array of parents, so that `t[i] === x` means that `x`
//   // is the parent of `i`
//   var t = [];
//   for (var i = 0; i < nodes.length; i++) {
//     // t[nodes[i].id] = nodes[i].parent;
//     t[nodes[i].id] = nodes[i].parentId;
//   }

//   // `t` represents the array of parents
//   // `c` represents the parent whose children should be put in the outputted array
//   function f(t, c) {
//     // The output structure
//     var a = [];

//     // We loop through all the nodes to fill `a`
//     for (var i = 0; i < t.length; i++) {
//       // If the node has the parent `c`
//       console.log(t[i]);
//       if (t[i] === c) {
//         // Create an object with the `id` and `sub` properties and push it
//         // to the `a` array
//         a.push({
//           id: i,
//           // The `sub` property's value is generated recursively
//           sub: f(t, i),
//         });
//       }
//     }

//     // Finish by returning the `a` array
//     return a;
//   }

//   // Print the outputted array in a pretty way
//   // We call the `f` function with the 0 parameter because 0 is the parent of the
//   // nodes that should be directly put in the returned array
//   var util = require("util");
//   console.log(
//     util.inspect(f(t, 0), {
//       colors: true,
//       depth: null,
//     })
//   );

//   return f(t, 0);
// }
