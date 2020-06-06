<template>
	<view class="">
		<view v-for="(item,index) in list" :key='index' class="coupon d-flex position-relative" :class="isPay ? 'pay-coupon' : ''" @tap="clickCoupon(item)">
			<view class="d-flex a-center j-center" style="border-right: 2rpx dashed #666666;" :style="{width: isPay ? '34%' : '30%'}">
				<view class="" style="color: #73878e;" :style="{fontSize: isPay ? '50rpx' : '60rpx'}">
					￥<text style=": 1;font-weight: 600;" :style="{fontSize: isPay ? '70rpx' : '80rpx'}">{{item.discount}}</text>
				</view>
			</view>
			<view class="py-1 pl-2 pr-2 w-100" :class="item.type == 0 ||  item.type ? 'd-flex j-sb a-center' : ''" :style="{width: isPay ? '66%' : '70%'}">
				<view class="w-100">
					<view :class="isPay ? '' : 'font-md'">{{item.name}}</view>
					<view class="d-flex j-sb a-center" style="color: #777777;width: 98%;">
						<view class="" :class="isPay ? 'font-sm' : 'font'">
							<text>{{item.start}}</text>-
				 			<text>{{item.end}}</text>
						</view>
						<view v-if="item.state == 0 || item.state == 1" @tap="getCoupon(item)">
							<text class="text-fff px-2 py-1" style="border-radius: 10rpx;"  :class="isPay ? 'font' : ''"
								  :style="{background: item.state == 0 ? '#f1452f' : '#73878e'}">
								{{item.state == 0 ? '未领取' : '已领取'}}
							</text>
						</view>
					</view>
					<view :class="isPay ? '' : 'font-md'" style="color: #777777;line-height: 1.3;">{{item.condition}}</view>
				</view>
				<view v-if="item.type == 0 || item.type == 1" class="" style="width: 150rpx;height: 150rpx;">
					<image class="w-100 h-100" :src="item.type == 0 ? '/static/weishi.png' : '/static/yishi.png'" mode=""></image>
				</view>
			</view>
			<view v-if="item.status == 1" class="position-absolute" style="right: 0;bottom: 0;width: 100rpx;height: 100rpx;">
				<image class="w-100 h-100" src="/static/gouxuan.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list: {
				type: Array
			},
			isPay: {
				type: Boolean,
				default: false
			}
		},
		methods:{
			clickCoupon(item){
				this.$emit('tapCoupon',item)
			},
			getCoupon(item){
				this.$emit('getCoupon',item)
			}
		}
	}
</script>

<style>
	.coupon{
		background: url(/static/bg.png) no-repeat;
		background-size: contain;
		background-position: center center;
		padding: 30rpx 10rpx;
		width: 730rpx;
		height: 230rpx;
		margin: 20rpx auto 0;
		box-sizing: border-box;
	}
	.pay-coupon.coupon{
		width: 690rpx;
		height: 210rpx;
	}
</style>
