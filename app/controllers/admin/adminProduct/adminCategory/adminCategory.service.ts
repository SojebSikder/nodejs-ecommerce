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

  async create({ name, published }) {
    const _name = name;
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
        slug: _slug,
        published: publishedValue,
      },
    });
    return result;
  }

  async findAll() {
    const result = await prisma.category.findMany();
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
