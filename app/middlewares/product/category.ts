import { Request, Response } from "express";
import { AdminCategoryService } from "../../controllers/admin/adminProduct/adminCategory/adminCategory.service";

/**
 * Middleware for get categories
 */
export function getCategory() {
  return async function (req: Request, res: Response, next) {
    const result = await AdminCategoryService.getInstance().findAll();

    res.locals.categories = result;
    next();
  };
}
