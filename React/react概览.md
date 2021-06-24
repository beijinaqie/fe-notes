[toc]

# 组件类

![](https://mmbiz.qpic.cn/mmbiz_jpg/2KticQlBJtdx2IePG6IEmkBDkvWE1GKppN5jeazXCeoCqNDgIlOO1NrpeUyH2mx3NMHcvObMqo6ZAxPWdOWoTKQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## Component

`Component`组件是react中class组件的基石，类组件都是基于此进行创建

在**react/src/ReactBaseClasses.js**中，`updater`对象上保存着更新组件的方法

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
```

**我们声明的类组件是什么时候以何种形式被实例化的呢？**

**react-reconciler/src/ReactFiberClassComponent.js**

```js
function constructClassInstance(
    workInProgress,
    ctor,
    props
){
   const instance = new ctor(props, context);
    instance.updater = {
        isMounted,
        enqueueSetState(){
            /* setState 触发这里面的逻辑 */
        },
        enqueueReplaceState(){},
        enqueueForceUpdate(){
            /* forceUpdate 触发这里的逻辑 */
        }
    }
}
```

实例化我们类组件，然后赋值`updater`对象，负责组件的更新。然后在组件各个阶段，执行类组件的`render`函数，和对应的生命周期函数就可以了



我们自己写的组件需要继承`Component`组件且必须有个定义的`render`函数，这样才能继承`Component`中众多的特性。

### 组件声明周期

[生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

![](/Users/beijinaqie/笔记/fe-notes/images/iShot2021-05-14 16.18.16.png)

#### 挂载

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

- [**`constructor()`**](https://zh-hans.reactjs.org/docs/react-component.html#constructor)

  **如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数。**在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前前调用 `super(props)`。否则，`this.props` 在构造函数中可能会出现未定义的 bug。

  通常，在 React 中，构造函数仅用于以下两种情况：

  + 通过给 `this.state` 赋值对象来初始化[内部 state](https://zh-hans.reactjs.org/docs/state-and-lifecycle.html)。

  + 为[事件处理函数](https://zh-hans.reactjs.org/docs/handling-events.html)绑定实例

  在 `constructor()` 函数中**不要调用 `setState()` 方法**。如果你的组件需要使用内部 state，请直接在构造函数中为 **`this.state` 赋值初始 state**

  ```jsx
  constructor(props) {
    super(props);
    // 不要在这里调用 this.setState()
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  ```

  注意**避免将 props 的值复制给 state！这是一个常见的错误：**

  ```jsx
  constructor(props) {
   super(props);
   // 不要这样做
   this.state = { color: props.color };
  }
  ```

  如此做毫无必要（你可以直接使用 `this.props.color`），同时还产生了 bug（更新 prop 中的 `color` 时，并不会影响 state）。

  **只有在你刻意忽略 prop 更新的情况下使用。**此时，应将 prop 重命名为 `initialColor` 或 `defaultColor`。必要时，你可以[修改它的 `key`](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)，以强制“重置”其内部 state。

  请参阅关于[避免派生状态的博文](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)，以了解出现 state 依赖 props 的情况该如何处理。

- [`static getDerivedStateFromProps()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)

  `getDerivedStateFromProps` 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 `null` 则不更新任何内容。

  ```jsx
  static getDerivedStateFromProps(props, state)
  ```

  

- [**`render()`**](https://zh-hans.reactjs.org/docs/react-component.html#render)

  `render()` 方法是 class 组件中唯一必须实现的方法。

  当 `render` 被调用时，它会检查 `this.props` 和 `this.state` 的变化并返回以下类型之一：

  - **React 元素**。通常通过 JSX 创建。例如，`<div />` 会被 React 渲染为 DOM 节点，`<MyComponent />` 会被 React 渲染为自定义组件，无论是 `<div />` 还是 `<MyComponent />` 均为 React 元素。
  - **数组或 fragments**。 使得 render 方法可以返回多个元素。欲了解更多详细信息，请参阅 [fragments](https://zh-hans.reactjs.org/docs/fragments.html) 文档。
  - **Portals**。可以渲染子节点到不同的 DOM 子树中。欲了解更多详细信息，请参阅有关 [portals](https://zh-hans.reactjs.org/docs/portals.html) 的文档
  - **字符串或数值类型**。它们在 DOM 中会被渲染为文本节点
  - **布尔类型或 `null`**。什么都不渲染。（主要用于支持返回 `test && <Child />` 的模式，其中 test 为布尔类型。)

  `render()` 函数应该为纯函数，这意味着在不修改组件 state 的情况下，每次调用时都返回相同的结果，并且它不会直接与浏览器交互。

  如需与浏览器进行交互，请在 `componentDidMount()` 或其他生命周期方法中执行你的操作。保持 `render()` 为纯函数，可以使组件更容易思考。

  如果 `shouldComponentUpdate()` 返回 false，则不会调用 `render()`。

- [**`componentDidMount()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentdidmount)

  `componentDidMount()` 会在组件挂载后（插入 DOM 树中）立即调用。依赖于 DOM 节点的初始化应该放在这里。如需通过网络请求获取数据，此处是实例化请求的好地方。

  这个方法是比较适合添加订阅的地方。如果添加了订阅，请不要忘记在 `componentWillUnmount()` 里取消订阅

  你可以在 `componentDidMount()` 里**直接调用 `setState()`**。它将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。如此保证了即使在 `render()` 两次调用的情况下，用户也不会看到中间状态。请谨慎使用该模式，因为它会导致性能问题。通常，你应该在 `constructor()` 中初始化 state。如果你的渲染依赖于 DOM 节点的大小或位置，比如实现 modals 和 tooltips 等情况下，你可以使用此方式处理

#### 更新

当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

- [`static getDerivedStateFromProps()`](https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops)

  同上

- [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)

  ```jsx
  shouldComponentUpdate(nextProps, nextState)
  ```

  根据 `shouldComponentUpdate()` 的返回值，判断 React 组件的输出是否受当前 state 或 props 更改的影响。默认行为是 state 每次发生变化组件都会重新渲染。大部分情况下，你应该遵循默认行为。

  当 props 或 state 发生变化时，`shouldComponentUpdate()` 会在渲染执行之前被调用。返回值默认为 true。首次渲染或使用 `forceUpdate()` 时不会调用该方法

  此方法仅作为**[性能优化的方式](https://zh-hans.reactjs.org/docs/optimizing-performance.html)**而存在。不要企图依靠此方法来“阻止”渲染，因为这可能会产生 bug。你应该**考虑使用内置的 [`PureComponent`](https://zh-hans.reactjs.org/docs/react-api.html#reactpurecomponent) 组件**，而不是手动编写 `shouldComponentUpdate()`。`PureComponent` 会对 props 和 state 进行浅层比较，并减少了跳过必要更新的可能性。

- [**`render()`**](https://zh-hans.reactjs.org/docs/react-component.html#render)

  同上

- [`getSnapshotBeforeUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)

  ```jsx
  getSnapshotBeforeUpdate(prevProps, prevState)
  ```

  getSnapshotBeforeUpdate()` 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 `componentDidUpdate()

- [**`componentDidUpdate()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentdidupdate)

  ```jsx
  componentDidUpdate(prevProps, prevState, snapshot)
  ```

  `componentDidUpdate()` 会在更新后会被立即调用。首次渲染不会执行此方法。

  当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）

#### 卸载

当组件从 DOM 中移除时会调用如下方法：

- [**`componentWillUnmount()`**](https://zh-hans.reactjs.org/docs/react-component.html#componentwillunmount)

  `componentWillUnmount()` 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 `componentDidMount()` 中创建的订阅等。

  `componentWillUnmount()` 中**不应调用 `setState()`**，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。

## PureComponent

`React.PureComponent` 与 [`React.Component`](https://zh-hans.reactjs.org/docs/react-api.html#reactcomponent) 很相似。两者的区别在于 [`React.Component`](https://zh-hans.reactjs.org/docs/react-api.html#reactcomponent) 并未实现 [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。

```jsx
class Index extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
           data:{
              name:'alien',
              age:28
           }
        }
    }
    handerClick= () =>{
        const { data } = this.state
        data.age++
        this.setState({ data })
    }
    render(){
        const { data } = this.state
        return <div className="box" >
        <div className="show" >
            <div> 你的姓名是: { data.name } </div>
            <div> 年龄： { data.age  }</div>
            <button onClick={ this.handerClick } >age++</button>
        </div>
    </div>
    }
}
```

因为data所指向的地址没有变更，导致不会更新

解决这个问题很简单，只需要在`handerClick`事件中这么写：

```jsx
 this.setState({ data:{...data} })
```

**浅拷贝**就能根本解决问题。

## memo

`React.memo`和`PureComponent`作用类似，可以用作性能优化，`React.memo` 是高阶组件，函数组件和类组件都可以使用， 和区别`PureComponent`是 `React.memo`只能对`props`的情况确定是否渲染，而`PureComponent`是针对`props`和`state`。

`React.memo` 接受两个参数，第一个参数原始组件本身，第二个参数，可以根据一次更新中`props`是否相同决定原始组件是否重新渲染。是一个返回布尔值，`true` 证明组件无须重新渲染，`false`证明组件需要重新渲染，这个和类组件中的`shouldComponentUpdate()`正好相反 。

**React.memo: 第二个参数 返回 `true` 组件不渲染 ， 返回 `false` 组件重新渲染。**

**shouldComponentUpdate: 返回 `true` 组件渲染 ， 返回 `false` 组件不渲染。**

# 工具类

![](https://mmbiz.qpic.cn/mmbiz_jpg/2KticQlBJtdx2IePG6IEmkBDkvWE1GKpplwZzHq6Pliatiaf5DVa4jnzibibCxO44hwq68diccNZLQooLYP81RmdrudQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## createElement

一提到`createElement`，就不由得和`JSX`联系一起。我们写的`jsx`，最终会被 `babel`，用`createElement`编译成`react`元素形式。

**`createElement`模型:**

```jsx
React.createElement(
  type,
  [props],
  [...children]
)
```

`createElement`参数：

**第一个参数:**如果是组件类型，会传入组件，如果是`dom`元素类型，传入`div`或者`span`之类的字符串。

**第二个参数:**:第二个参数为一个对象，在`dom`类型中为**属性**，在`组件`类型中为**props**。

**其他参数:**，依次为`children`，根据顺序排列。

**createElement做了些什么？**

经过`createElement`处理，最终会形成 `$$typeof = Symbol(react.element)`对象。对象上保存了该`react.element`的信息。

如果我们在`render`里面这么写：

```jsx
render(){
    return <div className="box" >
        <div className="item"  >生命周期</div>
        <Text  mes="hello,world"  />
        <React.Fragment> Flagment </React.Fragment>
        { /*  */ }
        text文本
    </div>
}
```

会被编译成这样：

```jsx
render() {
    return React.createElement("div", { className: "box" },
            React.createElement("div", { className: "item" }, "\u751F\u547D\u5468\u671F"),
            React.createElement(Text, { mes: "hello,world" }),
            React.createElement(React.Fragment, null, " Flagment "),
            "text\u6587\u672C");
    }
```

## createRef

`createRef`可以创建一个 `ref` 元素，附加在`react`元素上。

## Children

### map



# hooks

## useState

useState出现，使得react无状态组件能够像有状态组件一样，可以拥有自己state,useState的参数可以是一个具体的值，也可以是一个函数用于判断复杂的逻辑，函数返回作为初始值，usestate 返回一个数组，数组第一项用于读取此时的state值 ，第二项为派发数据更新，组件渲染的函数，函数的参数即是需要更新的值。useState和useReduce 作为能够触发组件重新渲染的hooks,我们在使用useState的时候要特别注意的是，useState派发更新函数的执行，就会让整个function组件从头到尾执行一次，所以需要配合useMemo，usecallback等api配合使用，这就是我说的为什么滥用hooks会带来负作用的原因之一了。以下代码为usestate基本应用。

```jsx
const DemoState = (props) => {
    /* number为此时state读取值 ，setNumber为派发更新的函数 */
    let [number, setNumber] = useState(0) /* 0为初始值 */
    return (<div>
        <span>{ number }</span>
        <button onClick={ ()=> {
          setNumber(number+1)
          console.log(number) /* 这里的number是不能够即使改变的  */
        } } ></button>
    </div>)
}
```

上边简单的例子说明了useState ,但是当我们在调用更新函数之后，state的值是不能即时改变的，只有当下一次上下文执行的时候，state值才随之改变。

```jsx
const a =1 
 const DemoState = (props) => {
    /*  useState 第一个参数如果是函数 则处理复杂的逻辑 ，返回值为初始值 */
    let [number, setNumber] = useState(()=>{
       // number
       return a===1 ? 1 : 2
    }) /* 1为初始值 */
    return (<div>
        <span>{ number }</span>
        <button onClick={ ()=>setNumber(number+1) } ></button>
    </div>)
}
```

## useEffect

如果你想在function组件中，当组件完成挂载，dom渲染完成，做一些操纵dom,请求数据，那么useEffect是一个不二选择，如果我们需要在组件初次渲染的时候请求数据，那么useEffect可以充当class组件中的 componentDidMount , **但是特别注意的是，如果不给useEffect执行加入限定条件，函数组件每一次更新都会触发effect ,那么也就说明每一次state更新，或是props的更新都会触发useEffect执行，此时的effect又充当了componentDidUpdate和componentwillreceiveprops，所以说合理的用于useEffect就要给effect加入限定执行的条件，也就是useEffect的第二个参数，这里说是限定条件，也可以说是上一次useeffect更新收集的某些记录数据变化的记忆，在新的一轮更新，useeffect会拿出之前的记忆值和当前值做对比，如果发生了变化就执行新的一轮useEffect的副作用函数，useEffect第二个参数是一个数组，用来收集多个限制条件** **。**

 ```jsx
 /* 模拟数据交互 */
 function getUserInfo(a){
     return new Promise((resolve)=>{
         setTimeout(()=>{ 
            resolve({
                name:a,
                age:16,
            }) 
         },500)
     })
 }
 
 
 const Demo = ({ a }) => {
     const [ userMessage , setUserMessage ] :any= useState({})
     const div= useRef()
     const [number, setNumber] = useState(0)
     /* 模拟事件监听处理函数 */
     const handleResize =()=>{}
     /* useEffect使用 ，这里如果不加限制 ，会是函数重复执行，陷入死循环*/
     useEffect(()=>{
         /* 请求数据 */
        getUserInfo(a).then(res=>{
            setUserMessage(res)
        })
        /* 操作dom  */
        console.log(div.current) /* div */
        /* 事件监听等 */
         window.addEventListener('resize', handleResize)
     /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */
     },[ a ,number ])
     return (<div ref={div} >
         <span>{ userMessage.name }</span>
         <span>{ userMessage.age }</span>
         <div onClick={ ()=> setNumber(1) } >{ number }</div>
     </div>)
 }
 ```

如果我们需要在组件销毁的阶段，做一些取消dom监听，清除定时器等操作，那么我们可以在useEffect函数第一个参数，结尾返回一个函数，用于清除这些副作用。相当于componentWillUnmount。

```jsx
const Demo = ({ a }) => {
    /* 模拟事件监听处理函数 */
    const handleResize =()=>{}
    useEffect(()=>{
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       /* 事件监听 */
       window.addEventListener('resize', handleResize)
       /* 此函数用于清除副作用 */
       return function(){
           clearInterval(timer) 
           window.removeEventListener('resize', handleResize)
       }
    },[ a ])
    return (<div  >
    </div>)
}
```

**async await**

不支持这种

```jsx
/* 错误用法 ，effect不支持直接 async await 装饰的 */
 useEffect(async ()=>{
        /* 请求数据 */
      const res = await getUserInfo(payload)
    },[ a ,number ])
```

建议这种

```jsx
useEffect(() => {
	(async () => {
  	await getList()
  })()
})
```

## useLayoutEffect

useEffect 执行顺序 组件更新挂载完成 -> 浏览器dom 绘制完成 -> 执行useEffect回调。

useLayoutEffect 执行顺序 组件更新挂载完成 -> 执行useLayoutEffect回调-> 浏览器dom 绘制完成

所以说useLayoutEffect 代码可能会阻塞浏览器的绘制 如果我们在useEffect 重新请求数据，渲染视图过程中，肯定会造成画面闪动的效果,而如果用useLayoutEffect ，回调函数的代码就会阻塞浏览器绘制，所以可定会引起画面卡顿等效果，那么具体要用 useLayoutEffect 还是 useEffect ，要看实际项目的情况，大部分的情况 useEffect 都可以满足的。

 ```jsx
 const DemoUseLayoutEffect = () => {
     const target = useRef()
     useLayoutEffect(() => {
         /*我们需要在dom绘制之前，移动dom到制定位置*/
         const { x ,y } = getPositon() /* 获取要移动的 x,y坐标 */
         animate(target.current,{ x,y })
     }, []);
     return (
         <div >
             <span ref={ target } className="animate"></span>
         </div>
     )
 }
 ```

## useRef

和传统的class组件ref一样，react-hooks 也提供获取元素方法 useRef,它有一个参数可以作为缓存数据的初始值，返回值可以被dom元素ref标记，可以获取被标记的元素节点。

**当然useRef还有一个很重要的作用就是缓存数据，我们知道usestate ,useReducer 是可以保存当前的数据源的，但是如果它们更新数据源的函数执行必定会带来整个组件从新执行到渲染，如果在函数组件内部声明变量，则下一次更新也会重置，如果我们想要悄悄的保存数据，而又不想触发函数的更新，那么useRef是一个很棒的选择。**

 **const currenRef = useRef(InitialData)** 

**获取 -> currenRef.current** 

**改变-> currenRef.current = newValue**

```jsx

const DemoUseRef = ()=>{
    const dom= useRef(null)
    const handerSubmit = ()=>{
        /*  <div >表单组件</div>  dom 节点 */
        console.log(dom.current)
    }
    return <div>
        {/* ref 标记当前dom节点 */}
        <div ref={dom} >表单组件</div>
        <button onClick={()=>handerSubmit()} >提交</button> 
    </div>
}
```

## useContext

我们可以使用useContext ，来获取父级组件传递过来的context值，这个当前值就是最近的父级组件 Provider 设置的value值，useContext参数一般是由 createContext 方式引入 ,也可以父级上下文context传递 ( 参数为context )。useContext 可以代替 context.Consumer 来获取Provider中保存的value值。

```jsx
/* 用useContext方式 */
const DemoContext = ()=> {
    const value:any = useContext(Context)
    /* my name is alien */
		return <div> my name is { value.name }</div>
}


/* 用Context.Consumer 方式 */
const DemoContext1 = ()=>{
    return <Context.Consumer>
         {/*  my name is alien  */}
        { (value)=> <div> my name is { value.name }</div> }
    </Context.Consumer>
}


export default ()=>{
    return <div>
        <Context.Provider value={{ name:'alien' , age:18 }} >
            <DemoContext />
            <DemoContext1 />
        </Context.Provider>
    </div>
}
```

## useReducer

## useMemo

无状态组件的componentShouldUpdate

useMemo的应用理念和memo差不多，都是判定是否满足当前的限定条件来决定是否执行useMemo的callback函数，而useMemo的第二个参数是一个deps数组，数组里的参数变化决定了useMemo是否更新回调函数，useMemo返回值就是经过判定更新的结果。它可以应用在元素上，应用在组件上，也可以应用在上下文当中。如果有一个循环的list元素，那么useMemo会是一个不二选择，接下来我们一起探寻一下useMemo的优点。

**1 useMemo可以减少不必要的循环，减少不必要的渲染。**

```jsx
/* 用 useMemo包裹的list可以限定当且仅当list改变的时候才更新此list，这样就可以避免selectList重新循环 */
 {useMemo(() => (
      <div>{
          selectList.map((i, v) => (
              <span
                  className={style.listSpan}
                  key={v} >
                  {i.patentName} 
              </span>
          ))}
      </div>
), [selectList])}

```

**2 useMemo可以减少子组件的渲染次数。**

```jsx
useMemo(() => (
    <Modal
        width={'70%'}
        visible={listshow}
        footer={[
            <Button key="back" >取消</Button>,
            <Button
                key="submit"
                type="primary"
             >
                确定
            </Button>
        ]}
    > 
     { /* 减少了PatentTable组件的渲染 */ }
        <PatentTable
            getList={getList}
            selectList={selectList}
            cacheSelectList={cacheSelectList}
            setCacheSelectList={setCacheSelectList} />
    </Modal>
 ), [listshow, cacheSelectList])
```

**3 useMemo让函数在某个依赖项改变的时候才运行，这可以避免很多不必要的开销**

```jsx
const DemoUseMemo=()=>{
  /* 用useMemo 包裹之后的log函数可以避免了每次组件更新再重新声明 ，可以限制上下文的执行 */
    const newLog = useMemo(()=>{
        const log =()=>{
            console.log(6666)
        }
        return log
    },[])
    return <div onClick={()=>newLog()} ></div>
}
```

## useCallback

useMemo和useCallback接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数，这个回调函数是经过处理后的也就是说父组件传递一个函数给子组件的时候，由于是无状态组件每一次都会重新生成新的props函数，这样就使得每一次传递给子组件的函数都发生了变化，这时候就会触发子组件的更新，这些更新是没有必要的，此时我们就可以通过usecallback来处理此函数，然后作为props传递给子组件。

```jsx
/* 用react.memo */
const DemoChildren = React.memo((props)=>{
   /* 只有初始化的时候打印了 子组件更新 */
    console.log('子组件更新')
   useEffect(()=>{
       props.getInfo('子组件')
   },[])
   return <div>子组件</div>
})


const DemoUseCallback=({ id })=>{
    const [number, setNumber] = useState(1)
    /* 此时usecallback的第一参数 (sonName)=>{ console.log(sonName) }
     经过处理赋值给 getInfo */
    const getInfo  = useCallback((sonName)=>{
          console.log(sonName)
    },[id])
    return <div>
        {/* 点击按钮触发父组件更新 ，但是子组件没有更新 */}
        <button onClick={ ()=>setNumber(number+1) } >增加</button>
        <DemoChildren getInfo={getInfo} />
    </div>
}
```

**这里应该提醒的是，useCallback ，必须配合 react.memo pureComponent ，否则不但不会提升性能，还有可能降低性能。**

# react-dom

