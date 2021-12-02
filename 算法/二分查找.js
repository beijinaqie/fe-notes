const assert = require('assert');

let arr = [3, 5, 19, 22, 25, 33, 45, 47, 57, 66, 71, 78, 81]
let arr1 = []
let arr2 = [2]

function binarySearch(arr, target) {
  let l = 0, 
      r = arr.length - 1,
      g

  while (l <= r) {
    g = ~~((l + r) / 2)
    // console.log(l, r, g, arr[g]);
    if (arr[g] === target) {
      return g
    } else if (arr[g] > target) {
      r = g - 1
    } else {
      l = g + 1
    }
  }
  return -1
}

// 断言测试
assert.strictEqual(binarySearch(arr, 1), -1)
assert.strictEqual(binarySearch(arr, 100), -1)
assert.strictEqual(binarySearch(arr, 19), 2)
assert.strictEqual(binarySearch(arr, 66), 9)
assert.strictEqual(binarySearch(arr, 3), 0)
assert.strictEqual(binarySearch(arr, 81), 12)
assert.strictEqual(binarySearch(arr1, 1), -1)
assert.strictEqual(binarySearch(arr2, 1), -1)
assert.strictEqual(binarySearch(arr2, 2), 0)
console.log('断言通过');

