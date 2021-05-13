

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

