/**
 * ArrayHelper class file.
 */
export class ArrayHelper {
  /**
   * convert array to string
   * @param {*} a
   * @returns {string}
   */
  public static arrayToString(a) {
    var s = "";
    for (var i = 0; i < a.length; i++) {
      if (s != "") s += ",";
      s += a[i];
    }
    return s;
  }

  /**
   * convert array to string with ('') quotation
   * @param {*} a
   * @returns {string}
   */
  public static arrayToStringWithQ(a) {
    var s = "";
    for (var i = 0; i < a.length; i++) {
      if (s != "") s += ",";
      s += `'${a[i]}'`;
    }
    return s;
  }

  /**
   * check if element is in array or not
   * @param needle
   * @param haystack
   * @returns
   */
  public static inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  }

  /**
   * Random Element - Takes an array as input and returns a random element
   */
  public static randomElement(array) {
    if (!Array.isArray(array)) {
      throw new Error("The parameter is not an array");
    }
    var item = array[Math.floor(Math.random() * array.length)];
    return item;
  }
}
