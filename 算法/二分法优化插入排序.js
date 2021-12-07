let arr = [5, 8, 1, 3, 2, 4, 9, 8]

function insert_sort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let p = i - 1;
    let target = arr[i];

    let l = 0;
    let r = p;
    let m = undefined;

    while (l <= r) {
      m = Math.floor((l + r) / 2);

      if (arr[m] > target) {
        r = m - 1
      } else {
        l = m + 1
      }
    }
    console.log(m, arr[m], target, l);
    // console.log(p, target)
    for (let j = p; j >= m; j--) {
      arr[j + 1] = arr[j];
    }
    arr[l] = target;
    // return 
    // while (p >= 0 && arr[p] > target) {
    //   arr[p + 1] = arr[p];
    //   p--;
    // }
    // arr[p + 1] = target;
  }
}

insert_sort(arr);
console.log(arr);


