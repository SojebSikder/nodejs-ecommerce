import { env } from "../../../system/src";
import { ShopService } from "../../controllers/shop/shop.service";

export async function subdomainMiddleware(req, res, next) {
  const domain = req.get("host").match(/\w+/); // e.g., host: "subdomain.website.com"
  if (domain) {
    const subdomain = domain[0]; // Use "subdomain"

    if (env("APP_HOST") != subdomain) {
      req.subDomain = subdomain;
      const checkDomain = await ShopService.getInstance().checkDomain({
        domain: subdomain,
      });
      if (!checkDomain) {
        res.send("Shop not exist");
      }
    }
  }
  next();
}
