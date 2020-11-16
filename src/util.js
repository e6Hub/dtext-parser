'use strict';

module.exports = new class Util {
  /**
   * an async forEach
   * @param {Array} arr
   * @param {Function} cb
   */
  async each(arr, cb) {
    for (let i = 0; i < arr.length; i++) {
      await cb(arr[i], i, arr);
    }
  }
}