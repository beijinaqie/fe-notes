[toc]

# 由promise/a+规范得来的结论

按照[Promise/a+](https://promisesaplus.com/)规范，

+ promise 有三个状态：`pending`，`fulfilled`，or `rejected`；

+ `new promise`时， 需要传递一个`executor()`执行器，执行器立即执行；

+ `executor`接受两个参数，分别是`resolve`和`reject`；

+ promise  的默认状态是 `pending`；

+ promise 有一个`value`保存成功状态的值，可以是`undefined/thenable/promise`；

+ promise 有一个`reason`保存失败状态的值；

+ promise 只能从`pending`到`rejected`, 或者从`pending`到`fulfilled`，状态一旦确认，就不会再改变；

+ promise 必须有一个`then`方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；

+ 如果调用 then 时，promise 已经成功，则执行`onFulfilled`，参数是`promise`的`value`；

+ 如果调用 then 时，promise 已经失败，那么执行`onRejected`, 参数是`promise`的`reason`；

+ 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调`onRejected`；
+ then 的参数 `onFulfilled` 和 `onRejected` 可以缺省，如果 `onFulfilled` 或者 `onRejected`不是函数，将其忽略，且依旧可以在下面的 then 中获取到之前返回的值
+ promise 可以 then 多次，每次执行完 promise.then 方法后返回的都是一个“新的promise"
+ 如果 then 的返回值 x 是一个普通值，那么就会把这个结果作为参数，传递给下一个 then 的成功的回调中；
+ 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调中；
+ 如果 then 的返回值 x 是一个 promise，那么会等这个 promise 执行完，promise 如果成功，就走下一个 then 的成功；如果失败，就走下一个 then 的失败；如果抛出异常，就走下一个 then 的失败；
+ 如果 then 的返回值 x 和 promise 是同一个引用对象，造成循环引用，则抛出异常，把异常传递给下一个 then 的失败的回调中；
+ 如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；

#### 规范

1.1 “promise”是一个具有then方法的对象或函数，其行为符合此规范。也就是说Promise是一个对象或者函数。

1.2 “thenable”是一个定义then方法的对象或函数，说句人话也就是这个对象必须要拥有then方法。

1.3 “value”是任何合法的JavaScript值（包括undefined、或者promise）。

1.4 promise中的异常需要使用throw语句抛出。

1.5 当promise失败的时候需要给出失败的原因。

#### 状态

1.1 promise必须要拥有三个状态: pending, fulfilled 和 rejected。

1.2 当promise的状态是pending时，他可以变为成功fulfilled或者失败rejected。

1.3 如果promise是成功状态，则他不能转换成任何状态，而且需要一个成功的值，并且这个值不能被改变。

1.4 如果promise是失败状态，则他不能转换成任何状态，而且需要一个失败的原因，并且这个值不能被改变。

#### then方法说明

1.1 一个promise必须要有一个then方法，而且可以访问promise最终的结果，成功或者失败的值。

1.2 then方法需要接收两个参数，onFulfilled 和 onRejected这两个参数是可选参数。

# 实现一个最简单的promsie

按照上面的特征，我们来实现下promise，首先来个最简单的

```js
class CustomPromise {
	// 一共三种状态，默认pending，且只能有pending => fulfilled、pending => rejected
  #status = 'pending';
  // 保存成功状态的值
  #value = undefined;
  // 保存失败状态的值
  #reason = undefined;
  
  // 执行构造函数，且参数为一个回调函数
  constructor(exector) {
  	// 执行该回调函数，并且将resolve，reject方法进行传递，这里传入的两个函数如何调用的话，其内部this会指向window，所以这里进行bind绑定实例对象this
		exector(this.#resolve.bind(this), this.#reject.bind(this))
	}

	// 实例方法then，拥有两个函数参数，为成功回调以及失败回调
	then(onFulfilled, onRejected) {
    if (this.#status === 'fulfilled') {
    	onFulfilled(this.#value)
    }
    
    if (this.#status === 'rejected') {
    	onRejected(this.#reason)
    }
  }

	// 调用该方法时，状态由pending => fulfilled，且将成功的值保存起来
	#resolve(value) {
		if (this.#status === 'pending') {
      this.#status = 'fulfilled';
      this.#value = value;
    }
	}
  
  // 调用该方法，状态由pending => rejected，且将失败的值保存起来
  #reject(reason) {
    if (this.#status === 'pending') {
      this.#status = 'rejected';
      this.#reason = reason;
    }
	}
  
}
```

我们来写个例子来测试下这段代码，这段代码能够准确运行

```js
new CustomPromise((resolve, reject) => {
  resolve('resolve')
}).then(res => {
  console.log(res) // resolve
})
```

# 给promise增加异步

那么问题来了，promsie的设计初衷是为了解决异步的，如果是异步的情况我们的程序该如何调整来适应它呢？

还是上面的代码，我们增加下异步试试

```js
new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
  }, 0)
}).then(res => {
  console.log(res) // 没有结果输出
})
```

你应该能够猜到为什么，在没有执行resolve时，当前的promsie状态停留在pending，而这个时候，已经调用了then方法，而在then方法内，处于pending状态下，我们无法执行任何操作，当前宏任务执行完毕，当前promsie状体修改为fulfilled，但是这个时候却没能再次调用then。好了，知道问题出在哪里，我们就来着手解决它。

修改以上代码

```js
class CustomPromise {
  
	// 一共三种状态，默认pending，且只能有pending => fulfilled、pending => rejected
  #status = 'pending';
  // 保存成功状态的值
  #value = undefined;
  // 保存失败状态的值
  #reason = undefined;
  + // 保存异步的成功回调数组
  + #fulfilledCb = [];
  + // 保存异步的失败回调数组
  + #rejectedCb = []; 
  
  // 执行构造函数，且参数为一个回调函数
  constructor(exector) {
  	// 执行该回调函数，并且将resolve，reject方法进行传递，这里传入的两个函数如何调用的话，其内部this会指向window，所以这里进行bind绑定实例对象this
		exector(this.#resolve.bind(this), this.#reject.bind(this))
	}

	// 实例方法then，拥有两个函数参数，为成功回调以及失败回调
	then(onFulfilled, onRejected) {
    
    + // 如果调用then方法时，当前promise状态处于pending，就将调用的方法进行收集
    + if (this.#status === 'pending') {
    +   // 异步成功数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onFulfilled，并将当前成功值value传入
    +		this.#fulfilledCb.push(() => { onFulfilled(this.#value) })	
    +		// 异步失败数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onRejected，并将当前失败值reason传入
    +   this.#rejectedCb.push(() => { onRejected(this.#reason) })
    + }
    
    // 调用then方法时，如果状态为fulfilled，就调用传入的onFulfilled回调函数并将保存的成功结果value作为参数返回
    if (this.#status === 'fulfilled') {
    	onFulfilled(this.#value)
    }
    
    // 调用then方法时，如果状态为rejected，就调用传入的onRejected回调函数并将失败结果reason作为参数返回
    if (this.#status === 'rejected') {
    	onRejected(this.#reason)
    }
  }

	// 调用该方法时，状态由pending => fulfilled，且将成功的值保存起来
	#resolve(value) {
		if (this.#status === 'pending') {
      this.#status = 'fulfilled';
      this.#value = value;
      + // 当异步结束执行resolve时，清空当前的异步成功数组
      + this.#fulfilledCb.map(onFulfilled => onFulfilled())
    }
	}
  
  // 调用该方法，状态由pending => rejected，且将失败的值保存起来
  #reject(reason) {
    if (this.#status === 'pending') {
      this.#status = 'rejected';
      this.#reason = reason;
      + // 当异步结束执行reject时，清空当前的异步失败数组
      + this.#rejectedCb.map(onRejected => onRejected())
    }
	}
  
}
```

让我们拿上面的例子再来测试一下，结果成功输出

```js
new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
  }, 0)
}).then(res => {
  console.log(res) // resolve
})
```

# 给promise增加值穿透特性，以及链式调用

我们对上面的例子进行改动，增加链式调用

```js
new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
  }, 0)
}).then(res => {
  console.log(res) 
}).then(res => { // 毫无疑问，报错了
  console.log(res)
})
```

那么我们来分析下为什么？new CustomPromise产生的实例，其身上是有then方法的，可是当调用完then方法后，其值是没有then方法的，那么如何让其拥有then方法呢？bingo！我们只需要在返回值的时候，返回的是一个新的promsie就行了，这样其身上就自带了then方法。好了，我们来修改上面的代码

```js
class CustomPromise {
  
	// 一共三种状态，默认pending，且只能有pending => fulfilled、pending => rejected
  #status = 'pending';
  // 保存成功状态的值
  #value = undefined;
  // 保存失败状态的值
  #reason = undefined;
  // 保存异步的成功回调数组
  #fulfilledCb = [];
  // 保存异步的失败回调数组
  #rejectedCb = []; 
  
  // 执行构造函数，且参数为一个回调函数
  constructor(exector) {
  	// 执行该回调函数，并且将resolve，reject方法进行传递，这里传入的两个函数如何调用的话，其内部this会指向window，所以这里进行bind绑定实例对象this
		exector(this.#resolve.bind(this), this.#reject.bind(this))
	}

	// 实例方法then，拥有两个函数参数，为成功回调以及失败回调
	then(onFulfilled, onRejected) {
    
    + // 解决then函数内部没有参数的问题
    + // onFulfilled如果没有值则传递到下一个then函数中
    + onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    + // onRejected需要抛出异常不然后面的then捕获不到
    + onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
    
    // 如果调用then方法时，当前promise状态处于pending，就将调用的方法进行收集
    if (this.#status === 'pending') {
      + return new CustomPromise((resolve, reject) => {
      +  // 异步成功数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onFulfilled，并将当前成功值value传入
      +  this.#fulfilledCb.push(() => { 
      +    const value = onFulfilled(this.#value);
      +    resolve(value);
      +  })
      +  // 异步失败数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onRejected，并将当前失败值reason传入
      +  this.#rejectedCb.push(() => { 
      +    const reason = onRejected(this.#reason);
      +    reject(reason);
      +  })
      + })
    }
    
    // 调用then方法时，如果状态为fulfilled，就调用传入的onFulfilled回调函数并将保存的成功结果value作为参数返回
    if (this.#status === 'fulfilled') {
     + // 拿到传递进来的promsie成功value值
     + const value = onFulfilled(this.#value);

     + return new CustomPromise((resolve, reject) => {
     +   // 向下一层promsie传递，并将其value传入
     +   resolve(value);
     + })
    }
    
    // 调用then方法时，如果状态为rejected，就调用传入的onRejected回调函数并将失败结果reason作为参数返回
    if (this.#status === 'rejected') {
     + // 拿到传递进来的promsie成功value值
     + const reason = onRejected(this.#reason);

     + return new CustomPromise((resolve, reject) => {
     +   // 向下一层promsie传递，并将其value传入
     +   reject(reason)
     + })
    }
  }

	// 调用该方法时，状态由pending => fulfilled，且将成功的值保存起来
	#resolve(value) {
		if (this.#status === 'pending') {
      this.#status = 'fulfilled';
      this.#value = value;
      // 当异步结束执行resolve时，清空当前的异步成功数组
      this.#fulfilledCb.map(onFulfilled => onFulfilled())
    }
	}
  
  // 调用该方法，状态由pending => rejected，且将失败的值保存起来
  #reject(reason) {
    if (this.#status === 'pending') {
      this.#status = 'rejected';
      this.#reason = reason;
      // 当异步结束执行reject时，清空当前的异步失败数组
      this.#rejectedCb.map(onRejected => onRejected())
    }
	}
  
}
```

接着我们在跑一下我们上面的例子，哦吼，跑的通了

```js
new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
  }, 0)
}).then(res => {
  console.log(res) // resolve
}).then(res => { 
  console.log(res) // undefined
})
```

但是我们作为一名jser，看到重复代码，不下意识的那啥嘛？对，就是提炼公共部分，复写成函数。

让我们来稍微改造下then函数

```js
class CustomPromise {
  
	// 一共三种状态，默认pending，且只能有pending => fulfilled、pending => rejected
  #status = 'pending';
  // 保存成功状态的值
  #value = undefined;
  // 保存失败状态的值
  #reason = undefined;
  // 保存异步的成功回调数组
  #fulfilledCb = [];
  // 保存异步的失败回调数组
  #rejectedCb = []; 
  
  // 执行构造函数，且参数为一个回调函数
  constructor(exector) {
  	// 执行该回调函数，并且将resolve，reject方法进行传递，这里传入的两个函数如何调用的话，其内部this会指向window，所以这里进行bind绑定实例对象this
		exector(this.#resolve.bind(this), this.#reject.bind(this))
	}

	// 实例方法then，拥有两个函数参数，为成功回调以及失败回调
	then(onFulfilled, onRejected) {
    
    // 解决then函数内部没有参数的问题
    // onFulfilled如果没有值则传递到下一个then函数中
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    // onRejected需要抛出异常不然后面的then捕获不到
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };

    return new CustomPromise((resolve, reject) => {
      
      // 如果调用then方法时，当前promise状态处于pending，就将调用的方法进行收集
      if (this.#status === 'pending') {
        // 异步成功数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onFulfilled，并将当前成功值value传入
        this.#fulfilledCb.push(() => { 
          const value = onFulfilled(this.#value);
          
          resolve(value);
        })
    
        // 异步失败数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onRejected，并将当前失败值reason传入
        this.#rejectedCb.push(() => { 
          const reason = onRejected(this.#reason);
                                    
          reject(reason);
        })
      }

      // 调用then方法时，如果状态为fulfilled，就调用传入的onFulfilled回调函数并将保存的成功结果value作为参数返回
      if (this.#status === 'fulfilled') {
        // 拿到传递进来的promsie成功value值
        const value = onFulfilled(this.#value);

        // 向下一层promsie传递，并将其value传入
        resolve(value);
      }
    
    
      // 调用then方法时，如果状态为rejected，就调用传入的onRejected回调函数并将失败结果reason作为参数返回
      if (this.#status === 'rejected') {
        // 拿到传递进来的promsie成功value值
        const reason = onRejected(this.#reason);

        // 向下一层promsie传递，并将其value传入
        reject(reason)
      }
      
    });
  }

	// 调用该方法时，状态由pending => fulfilled，且将成功的值保存起来
	#resolve(value) {
		if (this.#status === 'pending') {
      this.#status = 'fulfilled';
      this.#value = value;
      // 当异步结束执行resolve时，清空当前的异步成功数组
      this.#fulfilledCb.map(onFulfilled => onFulfilled())
    }
	}
  
  // 调用该方法，状态由pending => rejected，且将失败的值保存起来
  #reject(reason) {
    if (this.#status === 'pending') {
      this.#status = 'rejected';
      this.#reason = reason;
      // 当异步结束执行reject时，清空当前的异步失败数组
      this.#rejectedCb.map(onRejected => onRejected())
    }
	}
  
}
```

嗯，这样就顺眼多了，有的同学可能已经看出来了，你这都是按照你的定义的格式来进行传惨调用，万一用户不按照你的来呢？那我们就在辛苦点，给我们的类加上点判断。

# 给promise增加错误捕获机制

在我们的程序运行中，总会在一些函数或者网络请求上遇到运行错误，可控的话只是程序停止运行，严重的可能直接就崩溃了，所以我们在不可控的情况使用try catch来避免这种情况。毕竟我们的程序有很多都是用户的输入，互联网第一法则，永远不要相信用户的行为。

```js
class CustomPromise {
  
	// 一共三种状态，默认pending，且只能有pending => fulfilled、pending => rejected
  #status = 'pending';
  // 保存成功状态的值
  #value = undefined;
  // 保存失败状态的值
  #reason = undefined;
  // 保存异步的成功回调数组
  #fulfilledCb = [];
  // 保存异步的失败回调数组
  #rejectedCb = []; 
  
  // 执行构造函数，且参数为一个回调函数
  constructor(exector) {
  	// 执行该回调函数，并且将resolve，reject方法进行传递，这里传入的两个函数如何调用的话，其内部this会指向window，所以这里进行bind绑定实例对象this
    // 执行器增加错误捕获机制，如果遇到错误，则使用reject进行传递到下一个then函数的rejected状态函数
		+ try {
    +		exector(this.#resolve.bind(this), this.#reject.bind(this));
    + } catch(e) {
    +  this.#reject(e);
    + }
	}

	// 实例方法then，拥有两个函数参数，为成功回调以及失败回调
	then(onFulfilled, onRejected) {

    return new CustomPromise((resolve, reject) => {
      
      // 如果调用then方法时，当前promise状态处于pending，就将调用的方法进行收集
      if (this.#status === 'pending') {
        // 异步成功数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onFulfilled，并将当前成功值value传入
        this.#fulfilledCb.push(() => { 
          + try {
          +  const value = onFulfilled(this.#value);

          +  resolve(value);
          + } catch (e) {
          +  reject(e);
          + }
        })
    
        // 异步失败数组内保存着这样一个函数，当执行该函数时会求出调用then方法内的onRejected，并将当前失败值reason传入
        this.#rejectedCb.push(() => { 
          + try {
          +  const reason = onRejected(this.#reason);

          +  reject(reason);
          + } catch (e) {
          +  reject(e);
          + }
        })
      }

      // 调用then方法时，如果状态为fulfilled，就调用传入的onFulfilled回调函数并将保存的成功结果value作为参数返回
      if (this.#status === 'fulfilled') {
        + try {
        +  // 拿到传递进来的promsie成功value值
        +  const value = onFulfilled(this.#value);
        +  // 向下一层promsie传递，并将其value传入
        +  resolve(value);
        + } catch (e) {
        +  reject(e);
        + }
      }
    
    
      // 调用then方法时，如果状态为rejected，就调用传入的onRejected回调函数并将失败结果reason作为参数返回
      if (this.#status === 'rejected') {
        + try {
        +  // 拿到传递进来的promsie成功value值
        +  const reason = onRejected(this.#reason);

        +  // 向下一层promsie传递，并将其value传入
        +  reject(reason);
        + } catch (e) {
        +  reject(e);
        + }
      }
      
    });
  }

	// 调用该方法时，状态由pending => fulfilled，且将成功的值保存起来
	#resolve(value) {
		if (this.#status === 'pending') {
      this.#status = 'fulfilled';
      this.#value = value;
      // 当异步结束执行resolve时，清空当前的异步成功数组
      this.#fulfilledCb.map(onFulfilled => onFulfilled())
    }
	}
  
  // 调用该方法，状态由pending => rejected，且将失败的值保存起来
  #reject(reason) {
    if (this.#status === 'pending') {
      this.#status = 'rejected';
      this.#reason = reason;
      // 当异步结束执行reject时，清空当前的异步失败数组
      this.#rejectedCb.map(onRejected => onRejected())
    }
	}
  
}
```

在我们加上了异常捕获之后，如果出现错误就能够在下一个then函数中通过rejected拿到错误的值

# 判断promise的返回值

then函数的本质实际上就是把第一个参数onFulfilled的返回值包装成promise进行返回。但是由于是用户来进行返回的，所以其类型也有区别。

那么什么是 Thenable 对象呢？ES6 Promises里提到了Thenable这个概念，简单来说它就是一个非常类似promise的东西。 就像我们有时称具有 .length 方法的非数组对象为 Array like 一样，Thenable 指的是一个具有 .then 方法的对象。

这种将 Thenable对象转换为 Promise 对象的机制要求thenable对象所拥有的 then 方法应该和Promise所拥有的 then 方法具有同样的功能和处理过程， 在将 Thenable 对象转换为 Promise 对象的时候，还会巧妙的利用 Thenable 对象原来具有的 then 方法。

+ 如果是基本类型值

```js
new CustomPromise(resolve => {
  resolve('111') 
}).then(res => {
  return res; // 返回的是基本类型值
})
```

我们直接resolve()返回就行

+ 如果是返回的自己本身呢



