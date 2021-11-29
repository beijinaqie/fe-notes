> JavaScript 的一大特点是，函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念
>
> 因此函数体内部的this指向也各有不同，为了更改js函数体运行时的上下文而应运出现的三个函数call、apply、bind

# call

和apply不同的仅仅只是参数传递的不同，apply传递的是一个数组或者类数组，而call则是传递的一个参数列表

```js
fun.call(thisArg, arg1, arg2, ...)
```



# apply

```js
fun.apply(thisArg, [argsArray])
```

+ thisArg：在 fun 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
+ argsArray：一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。浏览器兼容性请参阅本文底部内容。

# bind

bind与call用法一致，但是bind返回的是一个绑定函数，不会主动执行，需要用户手动调用

```js
fun.bind(thisArg, arg1, arg2)()
```

