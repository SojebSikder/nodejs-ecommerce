import { PrismaClient } from "@prisma/client";
import { Auth } from "../../system/src/core/Auth";
const prisma = new PrismaClient();

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
    const user = Auth.userByCookie(req.signedCookies);
    if (user) {
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
    } else {
      req.user = "";
      next();
    }
  };
}
