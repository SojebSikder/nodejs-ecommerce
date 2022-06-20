/**
 * simple middleware example
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function helloWorld(name: string) {
  return function (req, res, next) {
    console.log(`Worked! ${name}`);
    next();
  };
}
