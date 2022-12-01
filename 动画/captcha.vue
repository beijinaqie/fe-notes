<template>
	<div v-show="show" class="captcha">
		<div v-if="type === 'SLIDER'" class="slider">
			<div class="content">
				<div id="bg-img-div" class="bg-img-div">
					<img id="bg-img" :src="data.backgroundImage" alt />
				</div>
				<div :style="sliderImgStyles" class="slider-img-div">
					<img id="slider-img" :src="data.sliderImage" alt />
				</div>
			</div>
			<div class="slider-move">
				<div class="slider-move-track">拖动滑块完成拼图</div>
				<div
					:style="moveStyles"
					class="slider-move-btn"
					@mousedown="$_slider_down($event)"
					@touchstart="$_slider_down($event)"
				></div>
			</div>
			<div class="bottom">
				<div v-show="showClose" class="close-btn" @click="$_close"></div>
				<div class="refresh-btn" @click="$_refresh"></div>
			</div>
		</div>

		<div v-if="type === 'ROTATE'" class="rotate">
			<div class="content">
				<div id="bg-img-div" class="bg-img-div">
					<img id="bg-img" :src="data.backgroundImage" alt />
				</div>
				<div :style="rotateImgStyles" class="rotate-img-div">
					<img id="rotate-img" :src="data.sliderImage" alt />
				</div>
			</div>
			<div class="slider-move">
				<div class="slider-move-track">拖动滑块旋转正确位置</div>
				<div
					:style="moveStyles"
					class="slider-move-btn"
					@mousedown="$_slider_down($event)"
					@touchstart="$_slider_down($event)"
				></div>
			</div>
			<div class="bottom">
				<div v-show="showClose" class="close-btn" @click="$_close"></div>
				<div class="refresh-btn" @click="$_refresh"></div>
			</div>
		</div>

		<div v-if="type === 'CONCAT'" class="concat">
			<div class="content">
				<div id="slider-img-div" :style="concatImgStyles" class="slider-img-div">
					<img id="slider-img" alt src="" />
				</div>
				<div id="bg-img-div" :style="bgImgStyles" class="bg-img-div"></div>
			</div>
			<div class="slider-move">
				<div class="slider-move-track">拖动滑块完成拼图</div>
				<div
					:style="moveStyles"
					class="slider-move-btn"
					@mousedown="$_slider_down($event)"
					@touchstart="$_slider_down($event)"
				></div>
			</div>
			<div class="bottom">
				<div v-show="showClose" class="close-btn" @click="$_close"></div>
				<div class="refresh-btn" @click="$_refresh"></div>
			</div>
		</div>

		<div v-if="type === 'WORD_IMAGE_CLICK'" class="word-click">
			<div class="slider-move">
				<span class="slider-move-span">请依次点击:</span><img :src="wordImgData.tipImage" class="tip-img" />
			</div>
			<div id="word-click-content" class="content" @click="$_word_click">
				<div id="bg-img-div" class="bg-img-div">
					<img id="bg-img" :src="wordImgData.backgroundImage" alt />
				</div>
				<div class="bg-click-div">
					<span
						v-for="item in clickData"
						:key="'click_' + item.count"
						:style="{ left: item.left, top: item.top }"
						class="click-span"
						>{{ item.count }}</span
					>
				</div>
			</div>
			<div class="bottom">
				<div v-show="showClose" class="close-btn" @click="$_close"></div>
				<div class="refresh-btn" @click="$_refresh"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="Captcha">
import { reactive, ref } from "vue";

const props = withDefaults(
	defineProps<{
		defaultShow?: boolean;
		defaultType?: "SLIDER" | "ROTATE" | "CONCAT" | "WORD_IMAGE_CLICK";
		showClose?: boolean;
	}>(),
	{
		defaultShow: true,
		defaultType: "SLIDER",
		showClose: false,
	},
);

const data = reactive<{
	backgroundImage: string | undefined;
	backgroundImageWidth: number;
	backgroundImageHeight: number;
	sliderImageWidth: number;
	sliderImageHeight: number;
	sliderImage: string | undefined;
	id: string | undefined;
	data: object | undefined;
}>({
	backgroundImage: undefined,
	backgroundImageWidth: 0,
	backgroundImageHeight: 0,
	sliderImageWidth: 0,
	sliderImageHeight: 0,
	sliderImage: undefined,
	id: undefined,
	data: undefined,
});
</script>
