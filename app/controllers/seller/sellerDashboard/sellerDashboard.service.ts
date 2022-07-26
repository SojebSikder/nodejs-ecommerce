import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SellerDashboardService {
  private static _instance: SellerDashboardService;

  /**
   * Create instance
   */
  public static getInstance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  create(data: any){
    return 'This action adds a new user';
  }

  findAll() {
    return 'This action returns all user';
  }

  findOne(id: string) {
    return 'This action returns a {id} user';
  }

  update(id: string, data: any) {
    return 'This action updates a {id} user';
  }

  remove(id: string) {
    return 'This action removes a {id} user';
  }
}
 