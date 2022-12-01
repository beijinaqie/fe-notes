<template>
  <div v-show="show" class="captcha">
    <div v-if="this.type === 'SLIDER'" class="slider">
      <div class="content">
        <div id="bg-img-div" class="bg-img-div">
          <img id="bg-img" :src="data.backgroundImage" alt/>
        </div>
        <div :style="sliderImgStyles" class="slider-img-div">
          <img id="slider-img" :src="data.sliderImage" alt/>
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">
          拖动滑块完成拼图
        </div>
        <div :style="moveStyles" class="slider-move-btn"
             @mousedown="$_slider_down($event)"
             @touchstart="$_slider_down($event)"></div>
      </div>
      <div class="bottom">
        <div v-show="showClose" class="close-btn" @click="$_close"></div>
        <div class="refresh-btn" @click="$_refresh"></div>
      </div>
    </div>

    <div v-if="this.type === 'ROTATE'" class="rotate">
      <div class="content">
        <div id="bg-img-div" class="bg-img-div">
          <img id="bg-img" :src="data.backgroundImage" alt/>
        </div>
        <div :style="rotateImgStyles" class="rotate-img-div">
          <img id="rotate-img" :src="data.sliderImage" alt/>
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">
          拖动滑块旋转正确位置
        </div>
        <div :style="moveStyles" class="slider-move-btn"
             @mousedown="$_slider_down($event)"
             @touchstart="$_slider_down($event)"></div>
      </div>
      <div class="bottom">
        <div v-show="showClose" class="close-btn" @click="$_close"></div>
        <div class="refresh-btn" @click="$_refresh"></div>
      </div>
    </div>

    <div v-if="this.type === 'CONCAT'" class="concat">
      <div class="content">
        <div id="slider-img-div" :style="concatImgStyles" class="slider-img-div">
          <img id="slider-img" alt src=""/>
        </div>
        <div id="bg-img-div" :style="bgImgStyles" class="bg-img-div">
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">
          拖动滑块完成拼图
        </div>
        <div :style="moveStyles" class="slider-move-btn"
             @mousedown="$_slider_down($event)"
             @touchstart="$_slider_down($event)"></div>
      </div>
      <div class="bottom">
        <div v-show="showClose" class="close-btn" @click="$_close"></div>
        <div class="refresh-btn" @click="$_refresh"></div>
      </div>
    </div>

    <div v-if="this.type === 'WORD_IMAGE_CLICK'" class="word-click">
      <div class="slider-move">
        <span class="slider-move-span">请依次点击:</span><img :src="wordImgData.tipImage" class="tip-img">
      </div>
      <div id="word-click-content" class="content" @click="$_word_click">
        <div id="bg-img-div" class="bg-img-div">
          <img id="bg-img" :src="wordImgData.backgroundImage" alt/>
        </div>
        <div class="bg-click-div">
          <span v-for="item in clickData" :key="'click_' + item.count" :style="{left: item.left, top: item.top }"
                class='click-span'
          >{{ item.count }}</span>
        </div>
      </div>
      <div class="bottom">
        <div v-show="showClose" class="close-btn" @click="$_close"></div>
        <div class="refresh-btn" @click="$_refresh"></div>
      </div>
    </div>
  </div>

</template>

<script>
import { getCaptchaGen, getCaptchaCheck } from "@/api/basics/user";
export default {
  name: "Captcha",
  props: {
    /**
     * 是否显示
     */
    defaultShow: {type: Boolean, default: true},
    /**
     * 验证码类型
     */
    defaultType: {type: String, default: 'SLIDER'},
    /**
     * 是否显示关闭按钮
     */
    showClose: {type: Boolean, default: false}
  },
  data() {
    return {
      TYPES: ['SLIDER', 'ROTATE', 'CONCAT', 'WORD_IMAGE_CLICK'],
      data: {
        backgroundImage: undefined,
        backgroundImageWidth: 0,
        backgroundImageHeight: 0,
        sliderImageWidth: 0,
        sliderImageHeight: 0,
        sliderImage: undefined,
        id: undefined,
        data: undefined
      },
      type: this.defaultType,
      checkData: {
        id: undefined,
        track: undefined
      },
      startX: 0,
      startY: 0,
      end: 206,
      moveX: 0,
      movePercent: 0,
      // 滑动轨迹滑动时间等数据
      trackData: {
        bgImageWidth: 0,
        bgImageHeight: 0,
        sliderImageWidth: 0,
        sliderImageHeight: 0,
        startSlidingTime: null,
        endSlidingTime: null,
        trackList: []
      },
      // 移动按钮样式
      moveStyles: {
        transform: 'translate(0px, 0px)',
        backgroundPosition: '-5px 11.79625%'
      },
      // 滑动样式
      sliderImgStyles: {
        transform: 'translate(0px, 0px)',
      },
      // 旋转样式
      rotateImgStyles: {
        transform: 'rotate(0deg)',
      },
      // 滚动还原样式
      concatImgStyles: {
        height: 0,
        backgroundImage: undefined,
        backgroundPosition: '0px 0px',
      },
      // 滚动还原背景图片
      bgImgStyles: {
        backgroundImage: undefined
      },
      // 文字点击数据
      wordImgData: {
        backgroundImage: undefined,
        tipImage: undefined
      },
      // 文字点击数据
      clickData: [{}],
      show: this.defaultShow
    }
  },
  created() {
    this.$_gen()
  },
  mounted() {
    const bgElements = document.getElementById('bg-img-div')
    this.trackData.bgImageWidth = bgElements.clientWidth
    this.trackData.bgImageHeight = bgElements.clientHeight
    if (this.defaultType === 'ROTATE') {
      this.trackData.bgImageWidth = this.end
    }
  },
  methods: {
    /**
     * 生成滑动验证图片
     */
    $_gen() {
      this.$_reset()
      getCaptchaGen(this.type).then(res => {
        var d = res.data.data;
        this.data = d.captcha
        this.data.id = d.id
        this.checkData.id = this.data.id
        let sliderElement = document.getElementById('slider-img')
        if (!sliderElement) {
          sliderElement = document.getElementById('rotate-img')
        }
        if (!sliderElement && this.type !== 'WORD_IMAGE_CLICK') {
          this.trackData.sliderImageWidth = sliderElement.clientWidth
          this.trackData.sliderImageHeight = sliderElement.clientHeight
        }
        if (this.type === 'CONCAT') {
          this.bgImgStyles.backgroundImage = 'url(' + this.data.backgroundImage + ')'
          const backgroundImageHeight = this.data.backgroundImageHeight;
          const height = ((backgroundImageHeight - this.data.data) / backgroundImageHeight) * 159;
          this.concatImgStyles.backgroundImage = 'url(' + this.data.backgroundImage + ')'
          this.concatImgStyles.height = height + 'px'
          const sliderImg = document.getElementById('slider-img-div')
          this.trackData.sliderImageWidth = sliderImg.clientWidth
          this.trackData.sliderImageHeight = sliderImg.clientHeight
          const bgImg = document.getElementById('bg-img-div')
          this.trackData.bgImageWidth = bgImg.clientWidth
          this.trackData.bgImageHeight = bgImg.clientHeight
        } else if (this.type === 'WORD_IMAGE_CLICK') {
          this.wordImgData.backgroundImage = this.data.backgroundImage
          this.wordImgData.tipImage = this.data.sliderImage
        }
        this.trackData.startSlidingTime = new Date()
        // console.log('init', JSON.stringify(this.trackData))
      })
    },
    /**
     * 验证
     */
    $_check() {
      this.trackData.startSlidingTime = this.getNowDate(this.trackData.startSlidingTime)
      this.trackData.endSlidingTime = this.getNowDate(this.trackData.endSlidingTime)
      if (this.type === 'WORD_IMAGE_CLICK') {
        const clickContent = document.getElementById('word-click-content')
        this.trackData.bgImageHeight = clickContent.clientHeight
        this.trackData.sliderImageHeight = -1
        this.trackData.sliderImageWidth = -1
      }
      getCaptchaCheck(this.checkData.id,this.trackData).then(res => {
        const result = res.data
        this.$emit('check', {'captchaId':this.checkData.id,'result':result.data})
        if (!result.data) {
          this.$message.error('验证失败')
          this.$_refresh()
          return
        }
        this.$message.success('验证成功')
      }).catch(() => this.$_refresh())
    },
    /**
     * 刷新
     */
    $_refresh() {
      this.$_gen()
    },
    /**
     * 重置
     */
    $_reset() {
      this.moveStyles.transform = 'translate(0, 0)'
      this.moveStyles.backgroundPosition = '-5px 11.79625%'
      this.sliderImgStyles.transform = 'translate(0, 0)'
      this.rotateImgStyles.transform = 'rotate(0deg)'
      this.concatImgStyles.backgroundPosition = '0px 0px'
      this.concatImgStyles.backgroundImage = undefined
      this.concatImgStyles.height = 0
      this.startX = 0
      this.startY = 0
      this.moveX = 0
      this.movePercent = 0
      this.checkData.track = undefined
      this.checkData.id = undefined
      this.data.id = undefined
      this.trackData.startSlidingTime = undefined
      this.trackData.endSlidingTime = undefined
      this.trackData.trackList = []

      this.wordImgData.backgroundImage = undefined
      this.wordImgData.tipImage = undefined
      this.clickCount = 0
      this.clickData = []
      window.removeEventListener("mousemove", this.$_move);

    },
    $_close() {
      this.show = false
    },

    /*
     * 滑动图片鼠标按下
     */
    $_slider_down(event) {
      let targetTouches = event.originalEvent ? event.originalEvent.targetTouches : event.targetTouches;
      let startX = event.pageX;
      let startY = event.pageY;
      if (startX === undefined) {
        startX = Math.round(targetTouches[0].pageX);
        startY = Math.round(targetTouches[0].pageY);
      }
      this.startX = startX
      this.startY = startY
      this.moveStyles.backgroundPosition = '-5px 31.0092%'

      const pageX = this.startX;
      const pageY = this.startY;
      const startTime = this.trackData.startSlidingTime;
      const trackArr = this.trackData.trackList;
      trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: "down",
        t: (new Date().getTime() - startTime.getTime())
      });
      console.log("start", startX, startY)
      // pc
      window.addEventListener("mousemove", this.$_move)
      window.addEventListener("mouseup", this.$_up)
      // 手机端
      window.addEventListener("touchmove", this.$_move, false)
      window.addEventListener("touchend", this.$_up, false)

    },
    /**
     * 移动
     * @param event
     */
    $_move(event) {
      if (event instanceof TouchEvent) {
        event = event.touches[0]
      }
      let pageX = Math.round(event.pageX);
      let pageY = Math.round(event.pageY);
      const startX = this.startX;
      const startY = this.startY;
      const startTime = this.trackData.startSlidingTime;
      const end = this.end;
      const bgImageWidth = this.trackData.bgImageWidth;
      const trackList = this.trackData.trackList;
      let moveX = pageX - startX;
      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "move",
        t: (new Date().getTime() - startTime.getTime())
      };
      trackList.push(track);
      if (moveX < 0) {
        moveX = 0;
      } else if (moveX > end) {
        moveX = end;
      }
      this.moveX = moveX;
      this.movePercent = moveX / bgImageWidth;

      this.moveStyles.transform = 'translate(' + moveX + 'px, 0px)'
      this.sliderImgStyles.transform = 'translate(' + moveX + 'px, 0px)'
      this.rotateImgStyles.transform = 'rotate(' + (moveX / (end / 360)) + 'deg)'
      this.concatImgStyles.backgroundPosition = (moveX + 'px 0px')
      console.log('move', JSON.stringify(track))
    },
    /**
     * 鼠标松下,进行验证
     * @param event
     */
    $_up(event) {

      window.removeEventListener("mousemove", this.$_move)
      window.removeEventListener("mouseup", this.$_up)
      window.removeEventListener("touchmove", this.$_move)
      window.removeEventListener("touchend", this.$_up)
      if (event instanceof TouchEvent) {
        event = event.changedTouches[0];
      }
      this.trackData.endSlidingTime = new Date()
      let pageX = Math.round(event.pageX);
      let pageY = Math.round(event.pageY);
      const startX = this.startX;
      const startY = this.startY;
      const startTime = this.trackData.startSlidingTime;
      const trackList = this.trackData.trackList;

      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: "up",
        t: (new Date().getTime() - startTime.getTime())
      }
      trackList.push(track)
      console.log('up', JSON.stringify(track))
      this.$emit('move-stop', this.checkData)
      this.$_check()
    },
    /**
     * 点击文字
     */
    $_word_click(event) {
      console.log(event);
      this.clickCount++;
      if (this.clickCount === 1) {
        this.trackData.startSlidingTime = new Date();
        // move 轨迹
        window.addEventListener("mousemove", this.$_word_move);
      }
      const trackList = this.trackData.trackList
      trackList.push({
        x: event.offsetX,
        y: event.offsetY,
        type: "click",
        t: (new Date().getTime() - this.trackData.startSlidingTime.getTime())
      });
      const left = event.offsetX - 10;
      const top = event.offsetY - 10;
      const clickData = this.clickData;
      clickData.push({
        count: this.clickCount,
        left: left + 'px',
        top: top + 'px'
      })
      if (this.clickCount === 4) {
        // 校验
        this.trackData.endSlidingTime = new Date();
        window.removeEventListener("mousemove", this.$_word_move);
        this.checkData.track = this.trackData
        this.$emit('move-stop', this.checkData)
        this.$_check()
      }
    },
    /**
     * 文字点击移动
     * @param event
     */
    $_word_move(event) {
      if (event instanceof TouchEvent) {
        event = event.touches[0];
      }
      console.log("x:", event.offsetX, "y:", event.offsetY, "time:", new Date().getTime() - this.trackData.startSlidingTime.getTime());
      const trackList = this.trackData.trackList
      trackList.push({
        x: event.offsetX,
        y: event.offsetY,
        t: (new Date().getTime() - this.trackData.startSlidingTime.getTime()),
        type: "move"
      });
    },
    getNowDate(date) {
      const dt = date
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, 0)
      const d = (dt.getDate() + '').padStart(2, 0)
      const hh = (dt.getHours() + '').padStart(2, 0)
      const mm = (dt.getMinutes() + '').padStart(2, 0)
      const ss = (dt.getSeconds() + '').padStart(2, 0)
      const sss = (dt.getMilliseconds() + '').padStart(2, 0)
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}.${sss}`

    }
  }
}
</script>

<style scoped>
/** slider css start **/
.slider {
  background-color: #fff;
  width: 278px;
  height: 285px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
  user-select: none;
}

.slider .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.slider .bg-img-div, .slider-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.slider .bg-img-div img {
  width: 100%;
}

.slider .slider-img-div img {
  height: 100%;
}

.slider .slider-move {
  height: 60px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.slider .bottom {
  height: 19px;
  width: 100%;
}

.slider .refresh-btn, .close-btn, .slider-move-track, .slider-move-btn {
  background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png) no-repeat;
}

.slider .refresh-btn, .close-btn {
  display: inline-block;
}

.slider .slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}


.slider .slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.slider .slider-move-btn:hover, .close-btn:hover, .refresh-btn:hover {
  cursor: pointer
}

.slider .bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.slider .bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
  margin-left: 10px;
}

/** slider css end **/

/** rotate css start **/
.rotate {
  background-color: #fff;
  width: 278px;
  height: 285px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
  user-select: none;
}

.rotate .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.rotate .bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.rotate .slider-img-div {
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.rotate .bg-img-div img {
  width: 100%;
}

.rotate.slider-img-div img {
  height: 100%;
}

.rotate .slider-move {
  height: 60px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.rotate .bottom {
  height: 19px;
  width: 100%;
}

.rotate .refresh-btn, .close-btn, .slider-move-track, .slider-move-btn {
  background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png) no-repeat;
}

.rotate .refresh-btn, .close-btn {
  display: inline-block;
}

.rotate .slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}


.rotate .slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.rotate .slider-move-btn:hover, .close-btn:hover, .refresh-btn:hover {
  cursor: pointer
}

.rotate .bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.rotate .bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
  margin-left: 10px;
}

.rotate .after {
  color: #88949d;
}


.rotate .rotate-img-div {
  height: 100%;
  position: absolute;
  transform: rotate(0deg);
  margin-left: 50px;
}

.rotate .rotate-img-div img {
  height: 100%;
}

/** rotate css end **/


/** concat css start **/
.concat {
  background-color: #fff;
  width: 278px;
  height: 285px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
  user-select: none;
}

.concat .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.concat .bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
  background-size: 100% 159px;
  background-image: none;
  background-position: 0 0;
  z-index: 0;

}

.concat .slider-img-div {
  height: 100%;
  width: 100%;
  background-size: 100% 159px;
  position: absolute;
  transform: translate(0px, 0px);
  /*border-bottom: 1px solid blue;*/
  z-index: 1;
}

.concat .bg-img-div img {
  width: 100%;
}

.concat .slider-img-div img {
  height: 100%;
}

.concat .slider-move {
  height: 60px;
  width: 100%;
  margin: 11px 0;
  position: relative;
}

.concat .bottom {
  height: 19px;
  width: 100%;
}

.concat .refresh-btn, .close-btn, .slider-move-track, .slider-move-btn {
  background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png) no-repeat;
}

.concat .refresh-btn, .close-btn {
  display: inline-block;
}

.concat .slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}


.concat .slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.concat .slider-move-btn:hover, .close-btn:hover, .refresh-btn:hover {
  cursor: pointer
}

.concat .bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.concat .bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
  margin-left: 10px;
}

/** concat css end **/

/** word_click css start **/
.word-click {
  background-color: #fff;
  width: 278px;
  height: 250px;
  z-index: 999;
  box-sizing: border-box;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
  position: relative;
  user-select: none;
}

.word-click .content {
  width: 100%;
  height: 159px;
  position: relative;
}

.word-click .bg-img-div {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
  z-index: 0;
}

.word-click .bg-click-div {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.word-click .slider-img-div {
  height: 100%;
  position: absolute;
  transform: translate(0px, 0px);
}

.word-click .bg-img-div img {
  width: 100%;
}

.word-click .slider-img-div img {
  height: 100%;
}

.word-click .slider-move {
  height: 40px;
  width: 100%;
  position: relative;
}

.word-click .bottom {
  height: 19px;
  width: 100%;
  margin-top: 10px;
}

.word-click .refresh-btn, .close-btn, .slider-move-track, .slider-move-btn {
  background: url(https://static.geetest.com/static/ant/sprite.1.2.4.png) no-repeat;
}

.word-click .close-btn:hover, .refresh-btn:hover {
  cursor: pointer
}

.word-click .refresh-btn, .close-btn {
  display: inline-block;
}

.word-click .slider-move .slider-move-track {
  line-height: 38px;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}


.word-click .slider-move .slider-move-btn {
  transform: translate(0px, 0px);
  background-position: -5px 11.79625%;
  position: absolute;
  top: -12px;
  left: 0;
  width: 66px;
  height: 66px;
}

.word-click .submit-div {
  width: 100%;
  height: 40px;
  position: relative;
  margin: 5px auto;
}

.word-click .bottom .close-btn {
  width: 20px;
  height: 20px;
  background-position: 0 44.86874%;
}

.word-click .bottom .refresh-btn {
  width: 20px;
  height: 20px;
  background-position: 0 81.38425%;
  margin-left: 10px;
}

.word-click .tip-img {
  width: 130px;
  position: absolute;
  right: 5px;
}

.word-click .slider-move-span {
  color: #7f8ba0;
  font-size: 18px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}

.word-click .click-span {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50px;
  background-color: #409eff;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  color: #fff;
  border: 2px solid #fff;
}

.word-click .submit-btn {
  height: 40px;
  width: 120px;
  line-height: 40px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  font-size: 15px;
  box-sizing: border-box;
  border: 1px solid #409eff;
  float: right;
  border-radius: 5px;
}

/** word_click css end **/

</style>
