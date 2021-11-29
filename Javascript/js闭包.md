# js闭包的定义

+ 例子1

```js
function a() {
	let num = 1;
  
  function b() {
		return num + 2
	}
  
  b()
}

a()
```

+ 例子2

```js
function a() {
  let num = 1;
  
  function b() {
    return num + 2
  }
  
  return b
}

let total = a()
```

以上两个函数a都为闭包函数，观察以上函数找出特点

1. 函数内部定义新的函数
2. 新函数内部使用外部函数的活动对象属性
3. 新函数被调用，产生新的函数执行上下文，外层函数即为闭包函数



说人话一点就是

1. 函数套函数
2. 且内部函数使用外部函数的属性(变量或函数)
3. 内部函数被使用