```js
var a = 0;
if (true) {
    function a () {

    }
    a = 3;

}
console.log(a) // a() {}
```

如果程序中遇见if语句的情况，且程序内恰好包含函数声明的情况(一般我们不会写出这样的代码，但是容易出现在面试题中)

首先看mdn的解释

> 一个被函数声明创建的函数是一个 Function 对象，具有 Function 对象的所有属性、方法和行为。查看 [Function](https://developer.mozilla.org/en-US/JavaScript/Reference/Global_Objects/Function) 以获取 function 的详细信息。
>
> 函数也可以被表达式创建（ [function expression](https://developer.mozilla.org/en-US/JavaScript/Reference/Operators/function) ）
>
> 函数可以被有条件来声明，这意味着，在一个 if 语句里，函数声明是可以嵌套的。有的浏览器会将这种有条件的声明看成是无条件的声明，无论这里的条件是true还是false，浏览器都会创建函数。因此，它们不应该被使用。
>
> 默认情况下，函数是返回 undefined 的。想要返回一个其他的值，函数必须通过一个 [return](https://developer.mozilla.org/en-US/JavaScript/Reference/Statements/return) 语句指定返回值。



1. if语句内的函数无论是否被执行，同样会被声明到当前作用域的顶部，只不过值不是函数体，你可以理解成披着函数的外衣但是值却是undefined，而在变量声明与函数声明中，毫无疑问，身为函数一等公民的函数声明优先级要高于变量声明。

2. if语句内即{}内被视为一个块级作用域，变量以及函数在此处遵循一般的声明规则

3. 在执行到函数声明时，当前作用域那个函数声明的变量会被赋值为函数体

4. 引用mdn的一句话，函数可以被有条件来声明，这意味着，函数声明可能出现在一个 if 语句里，但是，这种声明方式在不同的浏览器里可能有不同的效果。因此，不应该在生成环境代码中使用这种声明方式，应该使用函数表达式来代替。

5. 切记此方法仅适用于es5

   

