const arr = [2, 7, 1, 10, 56, 12, 1];


function selectFn(arr, j) {
  let maxIndex = 0;
  let len = arr.length;
  for(let i = 1;i < len - j; i++) {
    arr[maxIndex] < arr[i] && (maxIndex = i)
  }
  [arr[maxIndex], arr[len - 1 - j]] = [arr[len - 1 - j], arr[maxIndex]]
}

function selectSort(arr) {
  for(let i = 0; i < arr.length; i++) {
    selectFn(arr, i)
  }
}
selectSort(arr)
console.log(arr);