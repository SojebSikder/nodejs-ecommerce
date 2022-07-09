import { PrismaClient } from "@prisma/client";
import { Auth } from "../../system/core/Auth";

/**
 * simple middleware for authorization
 */
export function authorization() {
  return Auth.authToken(async function (error, data, req, res) {
    if (error) {
      res.redirect("/login");
    }
  });
}

export function setUser() {
  return async function (req, res, next) {
    const prisma = new PrismaClient();

    const user = Auth.userByCookie(req.signedCookies);
    const result = await prisma.user.findFirst({
      where: {
        id: user.userid,
      },
      select: {
        id: true,
        username: true,
        role: true,
        email: true,
      },
    });

    req.user = result;
    next();
  };
}
