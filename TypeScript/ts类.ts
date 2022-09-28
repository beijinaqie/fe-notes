class Person {
  // 其它属性可以在此定义，不标明默认都是public
  sex = 0
  // 直接在constructor中进行标识，(public，private，protected)
  // public 公开的 自己，子类以及外面都能访问
  // protected 受到保护的 只要自己和儿子能访问
  // private 只有自己能访问
  constructor(public name: string, public age: number) {
    // this.name = name;
    // this.age = age;
    
  }
}

let p = new Person('xxx', 20)

export {}