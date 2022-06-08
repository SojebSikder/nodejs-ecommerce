import { Request, Response } from "express";
import { env } from "../../system/util";
import { ProductService } from "./product.service";

export class ProductController {
  /**
   * show all data
   * @param req
   * @param res
   */
  async index(req: Request, res: Response) {
    const result = await ProductService.getInstance().index();
    res.render("index", { posts: result });
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ProductService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }

  /**
   * store data
   * @param req
   * @param res
   */
  async store(req: Request, res: Response) {
    await ProductService.getInstance().store(req, res);

    res.render("post/addPost", {
      message: "Post has been added successfully",
    });
  }

  /**
   * show add post page
   * @param req
   * @param res
   */
  showAddPostPage(req: Request, res: Response) {
    res.render("post/addPost", {
      message: "",
    });
  }
}
