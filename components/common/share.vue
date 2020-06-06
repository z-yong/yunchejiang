<template>
	<view class="share" @click="share">
		<!-- <text class="iconfont icon-fenxiang1"></text>
		<view class="font">分享有礼</view> -->
		<image class="w-100 h-100" src="/static/share.png" mode=""></image>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		methods:{
			share(){
				this.$emit('shareMess')
			}
		}
	}
</script>

<style>
	.share{
		position: fixed;
		right: 20upx;
		bottom: 240upx;
		width: 180upx;
		height: 180upx;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 2upx 2upx 5upx #ccc;
		background: #FFFFFF;
		opacity: 0.8;
		/* border: 1px solid #333; */
	}
</style>
