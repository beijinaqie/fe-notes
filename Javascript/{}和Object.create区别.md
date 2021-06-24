### 对象字面量

对象字面量{}创建出来的对象，其原型上会包含对象上的一些属性和方法，我们可能在不经意间就会修改掉它原型链上的方法

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-17 10.38.53.png" alt="如图" style="zoom:50%;" />

又比如想判断其对象内是否拥有某个属性时，`if ({}.hasOwnProperty)`，就会出现判断失误的情况

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-17 17.03.05.png" style="zoom:50%;" />

### new Object()

和对象字面量几乎没什么区别，唯一的区别也就是生成对象的过程略有不同，增加了原型链指向的过程。`实例对象.__proto__ === 构造函数.prototype`

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-18 14.09.11.png" style="zoom:50%;" />

### Object.create()

该方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

以null来创建对象，会得到一个纯净的空对象，其属性以及原型链上空空如也

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-17 10.40.04.png" style="zoom:50%;" />

以{}来创建对象，其在{}的原型链基础上又增加了一层原型

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-17 10.40.33.png" style="zoom:50%;" />

新对象.\__proto__ = {}

{}.\__proto__ = Object.prototype

以Object.prototype来创建对象，其表现形式和对象字面量保持一致

<img src="/Users/beijinaqie/笔记/fe-notes/images/iShot2020-11-17 10.41.09.png" style="zoom:50%;" />



