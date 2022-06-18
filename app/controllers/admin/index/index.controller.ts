import { Request, Response } from "express";
import { env } from "../../../../system/util";
import { IndexService } from "./index.service";

export class IndexController {
  /**
   * show all data
   * @param req
   * @param res
   */
  async index(req: Request, res: Response) {
    const result = await IndexService.getInstance().index();
    res.render("admin/index");
  }

  /**
   * show specific data
   * @param req
   * @param res
   */
  async show(req: Request, res: Response) {
    const id = req.params.id;
    const result = await IndexService.getInstance().show(id);
    res.locals.title = `${result.name} - ${env("APP_NAME")}`;
    res.render("post/postSingle", { post: result });
  }

  /**
   * store data
   * @param req
   * @param res
   */
  store = async (req: Request, res: Response) => {
    await IndexService.getInstance().store(req, res);

    res.render("post/addPost", {
      message: "Post has been added successfully",
    });
  };

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
