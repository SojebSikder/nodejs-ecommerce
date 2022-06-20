import { Auth } from "../../system";

/**
 * simple middleware for authorization
 */
export function authorization() {
  return Auth.authToken(function (error, data, req, res) {
    if (error) {
      res.redirect("/login");
    }
  });
}
