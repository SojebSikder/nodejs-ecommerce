import express from "express";
import { IndexController } from "../../controllers/admin/index/index.controller";

import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";

const router = express.Router();
const indexController = new IndexController();

router.get("/", decorateHtmlResponse(), indexController.index);
router.get("/post/add", decorateHtmlResponse(), indexController.showAddPostPage);
router.post("/post/add", decorateHtmlResponse(), indexController.store);
router.get("/post/:id", decorateHtmlResponse(), indexController.show);

export default router;
