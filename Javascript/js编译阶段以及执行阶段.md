[toc]

https://cloud.tencent.com/developer/article/1604839

# js的运行角色

+ js引擎

从头到尾负责整个 JavaScript 程序的编译及执行过程。

+ 编译器

词法分析/分词。 对代码进行分词，比如var a = 2;分成var、a、=、2 、;。空格是否会被当作词法单元，取决于空格在 这门语言中是否具有意义

语法分析/解析。 这个过程是将词法单元流(数组)转换成一个由元素逐级嵌套所组成的代表了程序语法 结构的树。这个树被称为“抽象语法树”(Abstract Syntax Tree，AST)

代码生成。 将 AST 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息 息相关。

+ 作用域

负责收集并维护由所有声明的标识符(变量)组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符(变量)的访问权限

# js的运行环境

- 全局环境（JS代码加载完毕后，进入代码预编译即进入全局环境）
- 函数环境（函数调用执行时，进入该函数环境，不同的函数则函数环境不同）
- eval（不建议使用，会有安全，性能等问题）

# js执行上下文生命周期

js执行上下文分为三个阶段

创建阶段 ——> 执行阶段 ——> 回收阶段

<hr style="background-color: red" />

# ES3 js执行流程概览

js不像其它语言一样需要编译后运行，而作为一门解释性语言，js是边编译边执行，借助`JIT`等各种方式进行优化。

js代码的执行过程分为三个阶段，

1. 语法分析阶段

   词法分析之后会进行语法分析将词法单元流形成ast语法树，并生成词法作用域也就是静态作用域，然后进行代码生成，这个时候会对变量分配存储空间，以及形成全局执行上下文。同时会对代码进行语法检查，如果不正确则会向外抛出异常，如果正确则会进入下一个阶段，预编译阶段

2. 预编译阶段

   预编译阶段会创建执行上下文也就是当前执行环境，js在遇到新的运行环境时便会创建新的执行上下文，主要是

   + 创建变量对象VO(Variable Object)
   + 建立作用域链(Scope Chain)
   + 确定this指向

3. 执行阶段。

   将编译阶段创建的执行上下文压入调用栈，并成为正在运行的执行上下文，当前执行上下文执行结束后，弹出调用栈

当读取到新的代码块时语法分析完成全局执行上下文也就创建完毕

js的整体代码作为一个全局执行上下文，我们用 globalContext 表示它，遇到函数调用时，就会新创建新的执行上下文，而对于一段程序来说，为了维护那么多执行上下文，js引擎便创建了执行上下文栈来管理执行上下文。函数调用便创建新的执行上下文并压入栈，函数调用完成，进行出栈操作。



执行上下文创建生命周期

![](https://images2015.cnblogs.com/blog/1061765/201703/1061765-20170318142429041-1593319621.png)

看一个例子：

```js
function foo(a) {
  console.log(b)
  console.log(c)
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

## 什么是变量对象

变量对象是在函数被调用，但是函数尚未执行的时刻被创建的，这个创建变量对象的过程实际就是函数内数据(函数参数、内部变量、内部函数)初始化的过程。



函数被调用时的VO对象

- 函数的所有形参 (如果是函数上下文)

  检查当前上下文中的参数，建立该对象的属性与属性值，仅在函数环境(非箭头函数)中进行，全局环境没有此过程

  a.由名称和对应值组成的一个变量对象的属性被创建
  b.没有实参，属性值设为 undefined

- 函数声明

  按代码顺序查找，将找到的函数提前声明，如果当前上下文的变量对象没有该函数名属性，则在该变量对象以函数名建立一个属性，属性值则为指向该函数所在堆内存地址的引用，如果存在，则会被新的引用覆盖。

  a.由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
  b.如果变量对象已经存在相同名称的属性，则完全替换这个属性

- 变量声明

  按代码顺序查找，将找到的变量提前声明，如果当前上下文的变量对象没有该变量名属性，则在该变量对象以变量名建立一个属性，属性值为undefined；如果存在，则忽略该变量声明

  a.由名称和对应值（undefined）组成一个变量对象的属性被创建；
  b.如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

```js
VO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

## 什么是活动对象

未进入执行阶段之前，变量对象中的属性都不能访问！但是进入执行阶段之后，变量对象转变为了**活动对象**，里面的属性都能被访问了，然后开始进行执行阶段的操作。所以活动对象实际就是变量对象在真正执行时的另一种形式

## 全局变量对象

我们上面说的都是函数上下文中的变量对象，是根据执行上下文中的数据(参数、变量、函数)确定其内容的，全局上下文中的变量对象则有所不同。以浏览器为例，全局变量对象是window对象，全局上下文在执行前的初始化阶段，全局变量、函数都是被挂载倒window上的。

## 作用域

作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。
JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。

因为 JavaScript 采用的是词法作用域，函数的作用域在函数定义的时候就决定了。
而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

经典的一道面试题

```js
var a = 1
function out(){
    var a = 2
    inner()
}
function inner(){
    console.log(a)
}
out()  //====>  1
```

## 作用域链

作用域链规定了当前上下文可以访问变量的权限顺序，即当前作用域没有查找到变量时会顺着作用域链往上查找，直至全局作用域

```js
var num = 30;

function test() {
    var a = 10;

    function innerTest() {
        var b = 20;

        return a + b
    }

    innerTest()
}

test()
```

`innerTest`的执行上下文

```js
innerTestEC = {

    //变量对象
    VO: {b: undefined}, 

    //作用域链
    scopeChain: [VO(innerTest), AO(test), AO(global)],  
    
    //this指向
    this: window
}
```



# ES5 js执行流程概览

## 针对es3修改

es5版本对es3版本进行了修改调整，删除了变量对象、活动对象、作用域链，将this指向修改成this绑定

## es5的执行上下文

```js
let a = 20;
const b = 30;
var c;

function multiply(e, f){
    var g = 20;
    return e*f*g;
}

c = multiply(20, 30);

```

以上面的例子为举例

1. 创建阶段。

   + 全局执行环境

     globalContext{

     ​	this绑定 // this指向的是`window`对象

     ​	词法环境{ // 用来存储诸如`let`、`const`、`class`、`function`变量

     ​		对象环境记录器{

     ​			// 标识符绑定，let、const、函数声明     		

     ​			a: <uninitialized>,    		

     ​			b: <uninitialized>,    		

     ​			multiply:< func >

     ​		}

     ​		外部环境引用 // 类似es3版本的作用域链，全局外部环境引用为null

     ​	}

     ​	变量环境{ // 用来存储`var`变量

     ​		对象环境记录器{

     ​			// 标识符绑定，var 声明            

     ​			c: undefined,

     ​		}

     ​		外部环境引用 // 类似es3版本的作用域链，全局外部环境引用为null

     ​	}

     }

   + 函数执行环境

     functionContext{

     ​	this绑定 // this指向最后调用函数的对象，箭头函数则指向当前执行上下文this

     ​	词法环境{

     ​		声明环境记录器{

     ​			// 标识符绑定    		

     ​			Arguments: { 

     ​				0:20, 

     ​				1:30, 

     ​				length: 2

     ​			}

     ​		}

     ​		外部环境引用 // 类似es3版本的作用域链，父级可能为window对象或者其它函数的词法环境

     ​	}

     ​	变量环境{

     ​		声明环境记录器{		

     ​			// 在这里绑定标识符         

     ​			g: undefined

     ​		}

     ​		外部环境引用 // 类似es3版本的作用域链，父级可能为window对象或者其它函数的词法环境

     ​	}

     }

   ```js
   // 全局执行上下文
   GlobalExectionContext = {
       // this 的值指向全局对象。(在浏览器中，this引用 Window 对象)
       ThisBinding: <Global Object>,
       // 词法环境
       LexicalEnvironment: {
       	EnvironmentRecord: {
       		Type: "Object",
       		// 标识符绑定，let、const、函数声明 
       		a: <uninitialized>,
       		b: <uninitialized>,
       		multiply:< func >
         }
         outer: <null>
       },
       // 变量环境
       VariableEnvironment: {
           EnvironmentRecord: {
               Type: "Object",
               // 标识符绑定，var 声明
               c: undefined,
           }
           outer: <null>
       }
   }
   
   // 函数执行上下文
   FunctionExectionContext = {
     	// 如果它被一个引用对象调用，那么 this 会被设置成那个对象，否则 this 的值被设置为全局对象或者 undefined（在严格模式下）
       ThisBinding: <this Object>,
       
       LexicalEnvironment: {
       	EnvironmentRecord: {
       		Type: "Declarative",
       		// 标识符绑定
       		Arguments: { 0:20, 1:30, length: 2},
         },
         outer: <GlobalLexicalEnvironment>
       },
           
       VariableEnvironment: {
           EnvironmentRecord: {
             Type: "Declarative",
             // 在这里绑定标识符
             g: undefined
           },
           outer: <GlobalLexicalEnvironment>
     	}
   }
   
   ```

   

2. 执行阶段

3. 回收阶段



# 有条件的创建函数(即在if语句内创建函数)

函数可以被有条件来声明，这意味着，在一个 if 语句里，函数声明是可以嵌套的。有的浏览器会将这种有条件的声明看成是无条件的声明，无论这里的条件是true还是false，浏览器都会创建函数。因此，它们不应该被使用。

默认情况下，函数是返回 undefined 的。想要返回一个其他的值，函数必须通过一个 [return](https://developer.mozilla.org/en-US/JavaScript/Reference/Statements/return) 语句指定返回值。

函数可以被有条件来声明，这意味着，函数声明可能出现在一个 if 语句里，但是，这种声明方式在不同的浏览器里可能有不同的效果。因此，不应该在生成环境代码中使用这种声明方式，应该使用函数表达式来代替。

```js
var hoisted = "foo" in this;
console.log(`'foo' name ${hoisted ? "is" : "is not"} hoisted. typeof foo is ${typeof foo}`);
if (false) {
  function foo(){ return 1; }
}

// 在Chrome里:
// 'foo' 变量名被提升，但是 typeof foo 为 undefined
//
// 在Firefox里:
// 'foo' 变量名被提升. 但是 typeof foo 为 undefined
//
// 在Edge里:
// 'foo' 变量名未被提升. 而且 typeof foo 为 undefined
//
// 在Safari里:
// 'foo' 变量名被提升. 而且 typeof foo 为 function
```

注意，即使把上面代码中的 if(false) 改为 if(true)，结果也是一样的