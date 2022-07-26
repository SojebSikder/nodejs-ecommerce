import { PrismaClient } from "@prisma/client";
import { Auth } from "../../../../system/src";

const prisma = new PrismaClient();

export class SellerOrderService {
  private static _instance: SellerOrderService;

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

  async findAll() {
    const user = Auth.userByCookie("");
    const result = await prisma.subOrder.findMany({
      where:{
        sellerId: 1
      }
    });
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
 