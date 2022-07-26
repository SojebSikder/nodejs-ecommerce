/**
 * Get env value
 * @function env
 * @author Sojeb Sikder <sojebsikder@gmail.com>
 */
export function env(key, defaultValue = null) {
  return process.env[key] || defaultValue;
}
