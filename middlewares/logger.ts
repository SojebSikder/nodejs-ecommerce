/**
 * simple middleware for logging request time
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export function logger(req, res, next) {
  console.log("new request received at " + new Date().toISOString());
  next();
}
