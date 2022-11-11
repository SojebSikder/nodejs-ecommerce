import { env } from "../../../system/src";

export function subdomainMiddleware(req, res, next) {
  const domain = req.get("host").match(/\w+/); // e.g., host: "subdomain.website.com"
  if (domain) {
    const subdomain = domain[0]; // Use "subdomain"

    if (env("APP_HOST") != subdomain) {
      req.subDomain = subdomain;
    }
  }
  next();
}
