import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Auth } from "../../../../system/core";

const prisma = new PrismaClient();

export class IndexService {
  private static _instance: IndexService;
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
  public async index() {
    const result = await prisma.product.findMany();
    return result;
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
    });
    return result;
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store(req: Request, res: Response) {
    const title = req.body.title;
    const content = req.body.content;

    const user = Auth.userByCookie(req.signedCookies);

    // const post = {
    //   title: title,
    //   content: content,
    //   authorId: user.userid,
    // };

    // const result = await prisma.product.create({
    //   data: post,
    // });
  }
}
