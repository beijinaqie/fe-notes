**ts内置了很多全局类型，不能重复声明类型，否则会产生冲突，解决冲突采用模块化来解决**

```js
// 声明模块来解决
export{}
```

枚举类型分为 1) 普通枚举 2) 异构枚举(存放的类型不统一) 3）常量枚举 使用const进行定义

ps: 除了数字之外的都不会产生反举，如果是常量枚举则不会产生对象


+ ts的类型总是在:后面，=后面则是赋值语法
+ ts只会在开发阶段存在，编译后类型就会消失
+ 虽然ts会自动推导类型，但是还是需要人为来声明类型
+ string(表示基本类型字符串) String(表示字符串实例) 类类型String可以用来表示实例类型

```js
let u:undefined = undefined;
let n:null = null;
```

严格模式下，null和undefined类型不允许互换

```js
function fn():void {
  return undefined
}
```

void类型 用于函数返回，表示没有返回值，但是返回值是void的可以返回undefined


```js
function fn():never {
  while(true) {}
  // 因为永远走不到这里，所以返回值是个never
}
```
never 是其它类型的字类型，可以赋值给其它类型，但是其他类型不能赋值给never

any 类型则是放弃了ts的类型校验，能不使用就不使用，ts为了解决any的不安全性出现了unknown