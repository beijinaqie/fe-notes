```js
项目遇到父组件传值给子组件，子组件监听数据变化可以用watch监听数据变化



如果要在子组件打印父组件传来的数据必须是在beforeUpdate和updated生命周期才能监听的到，

组件生命周期顺序如下：

Vue所有的生命周期钩子自动绑定在this上下文到实例中，因此你可以访问数据，对属性和方法进行运算。这意味着你不能使用箭头函数来定义一个生命周期方法。这是因为箭头函数绑定了父上下文，因此this与你期待的Vue实例不同。
1、beforeCreate
　　在实例初始化之后，数据观测和event/watcher时间配置之前被调用。
2、created
　　实例已经创建完成之后被调用。在这一步，实例已经完成以下的配置：数据观测，属性和方法的运算，watch/event事件回调。然而，挂载阶段还没开始，$el属性目前不可见。
3、beforeMount
　　在挂载开始之前被调用：相关的render函数首次被调用。
　　该钩子在服务器端渲染期间不被调用。
4、mounted
　　el被新创建的vm.$el替换，并挂在到实例上去之后调用该钩子函数。如果root实例挂载了一个文档内元素，当mounted被调用时vm.$el也在文档内。
　　该钩子在服务端渲染期间不被调用。
5、beforeUpdate
　　数据更新时调用，发生在虚拟DOM重新渲染和打补丁之前。
　　你可以在这个钩子中进一步第更改状态，这不会触发附加的重渲染过程。
　　该钩子在服务端渲染期间不被调用。
6、updated
　　由于数据更改导致的虚拟DOM重新渲染和打补丁，在这之后会调用该钩子。
　　当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。
　　该钩子在服务端渲染期间不被调用。
7、activated
　　keep-alive组件激活时调用。
　　该钩子在服务器端渲染期间不被调用。
8、deactivated
　　keep-alive组件停用时调用。
　　该钩子在服务端渲染期间不被调用。
9、beforeDestroy 【类似于React生命周期的componentWillUnmount】
　　实例销毁之间调用。在这一步，实例仍然完全可用。
　　该钩子在服务端渲染期间不被调用。
10、destroyed
　　Vue实例销毁后调用。调用后，Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

　　该钩子在服务端渲染不会被调用。


1.在new Vue（）的时候，vue\src\core\instance\index.js里面的_init()初始化各个功能

function Vue (options) {
if (process.env.NODE_ENV !== 'production' &&
  !(this instanceof Vue)
) {
  warn('Vue is a constructor and should be called with the `new` keyword')
}
this._init(options) //初始化各个功能
}
2.在_init()中有这样的一个执行顺序：其中initState()是在beforeCreate和created之间

  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm) //初始化
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created') 
3.在initState()做了这些事情：

if (opts.props) initProps(vm, opts.props)//初始化Props
if (opts.methods) initMethods(vm, opts.methods)//初始化methods
if (opts.data) {
  initData(vm)} else {
  observe(vm._data = {}, true /* asRootData */)}//初始化data
if (opts.computed) initComputed(vm, opts.computed)//初始化computed
4.所以Props，methods,data和computed的初始化都是在beforeCreated和created之间完成的。
```

