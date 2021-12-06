const assert = require('assert');

let arr = [2, 4, 7, 9, 13]
let arr1 = [2, 4, 7, 9, 13]
let arr2 = [2, 4, 7, 9, 13]

function insert(arr, len, target) {
  let i = len - 1;

  while (i >= 0 && arr[i] > target) {
    arr[i + 1] = arr[i]
    i--;
  }
  arr[i + 1] = target
}

insert(arr, arr.length, 1)
assert.deepEqual(arr, [1, 2, 4, 7, 9, 13])
insert(arr1, arr1.length, 8)
assert.deepEqual(arr1, [2, 4, 7, 8, 9, 13])
insert(arr2, arr2.length, 15)
assert.deepEqual(arr2, [2, 4, 7, 9, 13, 15])
console.log('断言通过');


function insert_sort(arr) {
  for (let i = 1; i < arr.length; i++) {
    insert(arr, i, arr[i])
  }
}

let arr3 = [5, 8, 1, 3, 2, 4, 9]
insert_sort(arr3)
assert.deepEqual(arr3, [1, 2, 3, 4, 5, 8, 9])
console.log('断言通过');