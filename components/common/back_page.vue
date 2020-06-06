<template>
	<view class="position-fixed text-center" @tap="goToBack"
	style="left: 20upx; top: 20upx; width: 60rpx;height: 60rpx;background: rgba(255,255,255,0.5); color: #333333; line-height: 60rpx;border-radius: 50%;">
		<text class="iconfont icon-xiangzuo3 font-md"></text>
	</view>
</template>

<script>
	export default{
		props:{
			market: {
				type: Boolean,
				default: false
			}
		},
		methods:{
			goToBack(){
				if(!this.market){
					uni.navigateBack({
						delta: 1
					})
				}else{
					this.$emit('goIndex')
				}
			}
		}
	}
</script>

<style>
</style>
