import express from "express";
import { ProductController } from "../controllers/product/product.controller";

import { decorateHtmlResponse } from "../middlewares/common/decorateHtmlResponse";

const router = express.Router();
const controller = new ProductController();

router.get("/", decorateHtmlResponse(), controller.index);
router.get("/product/:id", decorateHtmlResponse(), controller.show);
router.get("/product/add", decorateHtmlResponse(), controller.showAddPostPage);
router.post("/product/add", decorateHtmlResponse(), controller.store);

export default router;
