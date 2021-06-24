![](https://user-gold-cdn.xitu.io/2016/11/29/434fa0fe7e51a69c7953f456d7290649?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

> 数组方法伪代码展示

# pop

```js
Array.prototype.pop=function () {
  //this :当前实例
  var num=this[this.length-1];
  this.length--;
  return num;
};
console.log(ary.pop());
console.log(ary);

```

# push

```js
Array.prototype.push=function () {
  for (var i=0;i<arguments.length;i++){
    this[this.length]=arguments[i]
  }
  return this.length;
};
console.log(ary.push(1, 2, 3));
console.log(ary);

```

# shift

```js
Array.prototype.shift=function () {
  var num=this[0];
  for(var i=1;i<this.length;i++){
    this[i-1]=this[i];
  }
  this.length--;
  return num;
};
console.log(ary.shift());
console.log(ary);

```

# unshift

```js
Array.prototype.unshift=function () {
  var ary=[...arguments,...this];
  this.length=ary.length;
  for(var i=0;i<ary.length;i++){
    this[i]=ary[i];
  }
  return ary.length;
};
```

