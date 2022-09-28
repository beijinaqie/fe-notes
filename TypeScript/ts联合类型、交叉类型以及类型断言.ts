// as 语法用来将类型断言为某一类型

import { type } from "os"

function getBase(): string | number {
  return 1
}

// 因为ts推断不出getBase类型
let base: string | number = getBase()

// 此处将base断言成number类型
base as number

// 有一种断言方法，叫做非空断言，变量后加！表示这个变量不为空
base!

// type 类型别名，interface 接口不能使用联合类型

// 联合类型
// 联合类型未初始化时，取值只能取公共部分，而初始化赋值时则需要p1的属性或者p2的属性又或者两者属性都有
type p1 = {
  name: string,
  high: number,
}
type p2 = {
  name: string,
  age: number,
}

type p3 = p1 | p2;



let person3: p3 = {
  name: 'John',
  age: 20,
  high: 1.8
}

// 交叉类型
// 交叉类型未初始化时，取值可以取所有属性，而初始化赋值时则需要满足所有属性
type p4 = p1 & p2

let person4: p4 = {
  name: 'John',
  age: 20,
  high: 1.8
}

