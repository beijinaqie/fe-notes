const assert = require('assert');

let arr = [3, 5, 19, 22, 25, 33, 45, 47, 57, 66, 71, 78, 81]

function binarySearch(arr, target) {
  if (!arr.length) return
  if (arr.length === 1) return arr[0]

  let l = 0;
  let r = arr.length - 1;
  let g = ~~(r / 2)

  function recursive() {
    // console.log(l, r, g, arr[g]);
    if (l > r || r < l) return -1
    if (arr[g] === target) return g;

    if (arr[g] < target) {
      l = g + 1;
      g = ~~((r + l) / 2)
    } else {
      r = g - 1;
      g = ~~((r - l) / 2)
    }
    return recursive()
  }
  return recursive();
}


// 断言测试
assert.strictEqual(binarySearch(arr, 1), -1)
assert.strictEqual(binarySearch(arr, 19), 2)
assert.strictEqual(binarySearch(arr, 66), 9)
assert.strictEqual(binarySearch(arr, 3), 0)
assert.strictEqual(binarySearch(arr, 81), 12)