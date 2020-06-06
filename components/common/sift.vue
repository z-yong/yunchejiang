<template>
	<view class="sift">
		<view class="sift-title">
			<image :src="icon" mode="widthFix"></image>
			<text>{{title}}</text>
		</view>
		<view class="sift-content">
			<view class="sift-item" v-for="(itemS,iS) in menuSift" :key='iS'>
				<view class="sift-item-img">
					<image :src="itemS.img" mode="widthFix"></image>
				</view>
				<view class="sift-item-name">{{itemS.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			menuSift: Array,
			title: String,
			icon: String
		}
	}
</script>

<style>
	.sift{
		margin: 30upx 0 50upx;
	}
	.sift-title{
		display: flex;
		align-items: center;
		margin-left: 8upx;
	}
	.sift-title image{
		width: 25upx;
	}
	.sift-title text{
		font-weight: 600;
		font-size: 28upx;
		margin-left: 8upx;
	}
	.sift-content{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	.sift-content .sift-item{
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		margin-top: 40upx;
		width: 33.333%;
		height: 200upx;
		text-align: center;
		font-size: 26upx;
	}
	.sift-content .sift-item .sift-item-img{
		width: 100%;
		height: 150upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.sift-content .sift-item image{
		width: 110upx;
		height: 110upx;
	}
</style>
