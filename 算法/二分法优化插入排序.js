let arr = [5, 8, 1, 3, 2, 4, 9, 8]

function insert_sort(arr) {
  for (let i = 1; i < arr.length; i++) {
    // 整个有序长度
    let p = i - 1;
    // 待排序项
    let target = arr[i];

    // 有序项左侧
    let l = 0;
    // 有序项右侧
    let r = p;
    // 猜想的中点
    let m = undefined;

    while (l <= r) {
      m = Math.floor((l + r) / 2);

      // 升序排列中，如果中间项大于待排序项，说明待排序项在中间项左侧，r则需要中间点减1，反之则加1，相等则即为中间点
      if (arr[m] > target) {
        r = m - 1
      } else {
        l = m + 1
      }
    }
    // console.log(p, target)
    // 将待排序项最数组末端以此往后移1位
    for (let j = p; j >= m; j--) {
      arr[j + 1] = arr[j];
    }
    // 将数组l的索引赋值为待排序项
    arr[l] = target;
    // return 
    // while (p >= 0 && arr[p] > target) {
    //   arr[p + 1] = arr[p];
    //   p--;
    // }
    // arr[p + 1] = target;
  }
}

// insert_sort(arr);
// console.log(arr);



// 先实现有序数组内插入 [5, 8, 1, 3, 2, 4, 9, 8]
function insert(arr, len, target) {
  let l = 0;
  let r = len - 1;
  let g;
  
  while(l <= r) {
    g = ~~((l + r) / 2);
    if (arr[g] > target) {
      r = g - 1;
    } else {
      l = g + 1;
    }
  }
  
  while(len > l) {
    arr[len] = arr[len - 1];
    len--;
  }
  arr[l] = target;
}

// 在将数组循环进行逐个排序
function insertSort(arr) {
  for (let i = 1;i < arr.length;i++) {
    insert(arr, i, arr[i])
  }
}


insertSort(arr)
console.log(arr);