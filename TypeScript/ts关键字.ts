// type 类型别名
type p1 = string
type p2 = number

type p3 = p1 | p2





// as 断言
function getValue(): string | number {
  return 1
}
// 由于getValue返回值是联合类型，所以被赋值后的p依然被推导成联合类型，我们只能断言成具体类型
let p: string | number = getValue()
p as number




// ! 非空断言
// el的类型被推导成 HTMLElement | null我们可以断言成HTMLElement
const el = document.getElementById('app')
el as HTMLElement
// 或者使用 !
el!



// const 断言
let x = 'hello' as const;
type x = typeof x

let y = [10, 20] as const
type y = typeof y

let z = { text: 'xxx' } as const
type z = typeof z



// typeof 用来获取一个变量或对象的结构类型
const Person = {
  name: 'xxx',
  age: 20
}

type p4 = typeof Person




// keyof 获取某种类型的所有键，组成联合类型
// 能做为key的类型 string | number | symbol 特殊的
type k = keyof any 
type k1 = keyof number // 遍历number 取出属性做联合类型
type k2 = keyof string //

type p5 = keyof p4 // 'name' | 'age'





// ?表示可选
interface Person {
  name?: 'xxx',
  age: 20
}


interface Person {
  address: 'xxx'
}

const p6: Person = {
  age: 20,
  address: "xxx"
}


// extends 1) 在类里面使用表示继承  2) 表示约束 3）条件判断
class Animal {

}

// 表示继承
class Dog extends Animal {}


// 这里表示约束，传入的对象需要包含getNameType所有属性
type getNameType = {
  name: string,
  age: 20,
  sex: true
}

function  getName<T extends getNameType>(name: T): string {
  return ''
}

getName({
  name: 'xxx',
  age: 20
})


// 这里进行条件判断，只有传入联合类型才能进行类型分发功能
type h1 = string
type h2 = string | number

type h3 = h1 extends h2 ? 'string' : 'number'

// 总结起来就是，看看extends前面的类型能不能安全的赋值给后面的类型，能就是满足，或者就是后面的类型的范围包不包括前面类型
function getAge<T extends object>(age: T): void {

}
getAge({})



// in 取出联合类型，不能用于interface
const obj = {
  name: 'xx',
  age: 20,
  sex: true
}

// 取出obj的结构类型
type objConstructor = typeof obj
// 把obj结构key取出成联合类型
type objKey = keyof objConstructor

// 使用in取出联合类型的值
type objType = {
  [key in objKey]: any
}

export {}
