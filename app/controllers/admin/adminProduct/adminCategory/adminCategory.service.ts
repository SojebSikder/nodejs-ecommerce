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
    const _published = published;
    const _slug = _name.replace(/\s+/g, "-").toLowerCase();

    const result = await prisma.category.create({
      data: {
        name: _name,
        slug: _slug,
        published: _published,
      },
    });
    return result;
  }

  async findAll() {
    const result = await prisma.category.findMany();
    return result;
  }

  findOne(id: string) {
    return "This action returns a {id} user";
  }

  update(id: string, data: any) {
    return "This action updates a {id} user";
  }

  remove(id: string) {
    return "This action removes a {id} user";
  }
}
