/**
 * Get env value
 * @param {*} key
 * @param {*} defaultValue
 * @returns
 */
export function env(key, defaultValue = null) {
  return process.env[key] || defaultValue;
}
