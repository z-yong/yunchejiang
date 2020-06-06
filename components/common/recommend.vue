<template>
	<view class="recommend">
		<view class="reco-title">
			<view class="line"></view>
			<view class="reco-icon">
				<image src="/static/index/hot.png" mode="widthFix"></image>
			</view>
			<view class="text">套餐优惠</view>
			<view class="line"></view>
		</view>
		<z-goods-item :goodsList='goodsList'/>
	</view>
</template>

<script>
	import goodsItem from '@/components/common/goods_item.vue'
	export default{
		props:{
			goodsList: Array
		},
		components:{
			"z-goods-item": goodsItem
		},
		methods:{
			
		}
	}
</script>

<style>
	.recommend{
		padding-bottom: 30upx;
	}
	.recommend .reco-title{
		padding: 30upx 0;
		display: flex;
		width: 315upx;
		margin: auto;
		justify-content: space-between;
		align-items: center;
	}
	.recommend .reco-title .line{
		background: #ff1b0f;
		width: 58upx;
		height: 4upx;
	}
	.recommend .reco-title .reco-icon image{
		width: 30upx;
	}
	.recommend .reco-title .text{
		font-size: 38upx;
		color: #FF1B0F;
	}
	
</style>
