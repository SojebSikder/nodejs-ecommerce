import express from "express";
import { IndexController } from "../../controllers/admin/index/index.controller";

import { decorateHtmlResponse } from "../../middlewares/common/decorateHtmlResponse";

const router = express.Router();
const controller = new IndexController();

router.get("/", decorateHtmlResponse(), controller.index);
router.get("/post/add", decorateHtmlResponse(), controller.showAddPostPage);
router.post("/post/add", decorateHtmlResponse(), controller.store);
router.get("/post/:id", decorateHtmlResponse(), controller.show);

export default router;
