export default new class Util {
  async each<T>(arr: T[], cb: (item: T, itemIndex: number, itemArray: T[]) => Promise<unknown> | unknown) {
    for (let i = 0; i < arr.length; i++) {
      await cb(arr[i], i, arr);
    }
  }
}
