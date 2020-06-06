<template>
	<swiper indicator-dots circular autoplay :interval="3000" :duration="1000" class="index-bg" >
		<swiper-item v-for="(item,index) in banner" :key='index' style="width: 750rpx;height: 400rpx;">
			<image class="w-100 h-100" :src="item.pic || item.img" lazy-load mode=""></image>
		</swiper-item>
	</swiper>
</template>

<script>
	export default{
		props: {
			banner: {
				type: Array
			}
		}
	}
</script>

<style>
	.index-bg{
		width: 700upx;
		height: 322upx;
		margin: 30upx auto 0;
	}
	.index-bg image{
		width: 100%;
		height: 100%;
	}
</style>
