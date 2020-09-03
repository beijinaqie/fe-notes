+ css 单行溢出显示省略号



```css
// 需指定宽度
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
```



+ css 多行溢出显示省略号

```css
overflow:hidden;
text-overflow:ellipsis;
display:-webkit-box;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
```

