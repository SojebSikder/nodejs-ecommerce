import express from "express";
import { UserController } from "../controllers/user/user.controller";

import { decorateHtmlResponse } from "../middlewares/common/decorateHtmlResponse";
import { Auth } from "../system";

const router = express.Router();
const controller = new UserController();

router.get("/login", controller.showLoginPage);
router.post("/login", decorateHtmlResponse("login"), controller.signin);
router.get("/register", controller.showRegisterPage);
router.post("/register", controller.signup);
router.get("/logout", controller.logout);
router.get(
  "/profile",
  Auth.authToken((err, data, req, res) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = data;
    console.log(req.user);
  }, "asasas"),
  controller.showProfilePage
);

export default router;
