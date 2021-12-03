// let arr = [2, 4, 7, 9, 13]
let arr1 = [5, 2, 4, 6, 1, 3]

function insert(arr, target) {
  let idx = arr.findIndex(item => item > target);
  arr.splice(idx >= 0 ? idx : arr.length, 0, target);
}
// insert(arr, 1)
// console.log(arr);

function insert_sort(arr) {
  insert(arr, arr[1]);
}

insert_sort(arr1)

console.log(arr1);
