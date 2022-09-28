// 函数关心函数的参数以及返回值

// ts函数完整写法
let sumExple: (a: number, b: number) => number = (a: number, b: number): number => a + b;

// 但是ts能够通过函数的一边推导出另一边，因此我们只需要写一边的类型就可以

// 函数分为函数表达式以及函数声明两种

// 函数表达式
type Isum = (a: number, b: number) => number;

// 这种强调sum是Isum类型，需要特定的函数
const sum1: Isum = (a: number, b: number) => a + b

// 这种则是把一个函数赋值给一个变量进行储存
const sum2 = (a: number, b: number) => a + b

// 函数声明
// 直接在声明的过程对参数和返回值进行标识
function sum3(a: number, b: number): number{
  return a + b
}


// 函数内不要使用arguments，而是使用...args

// 函数内this指向问题，如果要指明函数内this指向的话，第一个参数就是this
function keyToValue(this: { name: string }, key: 'name') {
  return this[key]
}

keyToValue.call({ name: 'xxx' }, 'name')
