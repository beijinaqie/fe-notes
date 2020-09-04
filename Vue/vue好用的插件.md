```js
移动端Vue.js图片预览插件	vue-picture-preview

安装
npm install --save vue-picture-preview

首先在项目的入口文件中引入, 调用 Vue.use 安装。
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)

在根组件添加 lg-preview 组件的位置
<!-- Vue root compoment template -->

<div id="app">
    <router-view></router-view>
    <lg-preview></lg-preview>
</div>



对于所有图片都可以使用 v-preview 指令来绑定他们的预览功能
<img v-for="(img,index) in imgs"
     v-preview="img.url"
     :src="img.url"
     :alt="img.title"
     :key="index"
     preview-title-enable="true"
     preview-nav-enable="true">

isTitleEnable: (boolean, optional) 设置 preview-title-enable="false" 将禁用底部标题. 默认值: true.
isHorizontalNavEnable: (boolean, optional) 设置 preview-nav-enable="false" 将禁用水平导航. 默认值: true.


npm 地址
https://www.npmjs.com/package/vue-picture-preview

------------------------------------------------------------------------------------


Vue移动端左右滑动效果实现方法	vue-touch

2. 下载vue-touch （https://github.com/vuejs/vue-touch/tree/next） 注意：如果Vue是2.x 的版本的话，一定要下next分支上的。

3. 使用：

3.1 npm install vue-touch@next --save

3.2 在main.js 中 引入：

import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe = {
	threshold: 100 //手指左右滑动距离
}

3.3 在左右滑动页面的父页面使用,如：

<v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight"  tag="div">
	<router-view></router-view>
</v-touch>
左滑事件：swipeleft， 右滑事件：swiperight， 更多事件请查阅api
//左划      默认渲染为div   data为参数
<v-touch v-on:swipeleft="onSwipeLeft(data)">Swipe me!</v-touch>
//点击   渲染为一个a标签
<v-touch tag="a" v-on:tap="onTap">Tap me!</v-touch>
//点击   渲染为p标签
<v-touch tag="p" v-on:tap="onTap">Tap me!</v-touch>

4. 注意事项：

使用左右滑动之后，发现不能上下滑动了，这是因为vue-touch 默认禁止了用户的手势操作，注意组件上有个css属性：touch-action: none；
 把这个属性覆盖一下就好了，如： touch-action: pan-y!important;



npm 地址
https://www.npmjs.com/package/vue-touchjs
```

