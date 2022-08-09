import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CategoryService {
  private static _instance: CategoryService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  async findOneBySlug({ slug }) {
    const _slug = slug;
    const result = await prisma.category.findFirst({
      where: {
        slug: _slug,
      },
    });
    return result;
  }

  create(data: any) {
    return "This action adds a new user";
  }

  findAll() {
    return "This action returns all user";
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
