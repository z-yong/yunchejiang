<template>
	<view class="order_detail">
		<z-navbar title='订单详情'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo1 position-absolute text-fff" @tap="goBack"
					  style="left: 15rpx; top: 58rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view class="" style="margin-top: 130rpx; padding-bottom: 100rpx;">
			<view class="d-flex a-center p-2 main-bg-color">
				<!-- <view class="" style="width: 110rpx; height: 110rpx;overflow: hidden;border-radius: 50%;">
					<image class="w-100 h-100" src="/static/img/logo.jpg" mode=""></image>
				</view> -->
				<view class="text-fff ml-2">
					<view class="font-md" style="font-weight: 600;">{{currentIndex == 0 ? '请在5点之前完成支付' : '已完成支付'}}</view>
					<view class="mt font">{{time}}</view>
				</view>
			</view>
			<view class="p-2 text-center">
				<view class="d-flex j-sb a-center font-md">
					<view v-for="(item,index) in flowList" :key='index' class="flex-1">
						<view class="">{{item}}</view>
					</view>
				</view>
				<view class="d-flex j-ar a-center mt-2" style="padding: 0 70rpx;box-sizing: border-box;">
					<view v-for="(item,index) in nums" :key='index' class="d-flex j-ar a-center">
						<view v-if="index%2 == 0" class="dot" :class="currentIndex == index ? 'circle' : ''">
							<view class=""></view>
						</view>
						<view v-if="index%2 != 0" style="height: 2rpx; width: 110rpx;background: #666666;" ></view>
					</view>
				</view>
			</view>
			<z-cut/>
			<view v-if="address" class="p-3 position-relative" style="box-sizing: border-box;">
				<view class="" style="font-weight: 600;">
					<text>{{address.name}}</text>
					<text class="ml-2">{{address.tel}}</text>
				</view>
				<view class="mt-1 font" style="color: #888888;">{{address.address}}</view>
				<view class="position-absolute left-0 right-0" style="bottom: -16rpx;">
					<image style="width: 750rpx;" src="../../static/line.jpg" mode="widthFix"></image>
				</view>
			</view>
			<view v-else class="p-3">您还未选择地址，点击立即付款设置地址</view>
			<z-cut/>
			<view class="p-2">
				<view class="d-flex j-sb main-border-bottom">
					<view class="">共<text class="mx">{{goodsLists.length}}</text>件商品</view>
				</view>
				<z-goods-item classify :goodsList='goodsLists' isFlex isOrder/>
			</view>
			<z-cut/>
			<view class="py-1">
				<view v-for="(item,index) in orderList" :key='index' class="d-flex j-sb p-2 px-3">
					<view class="">{{item.name}}</view>
					<view class="d-flex a-center" style="color: #888888;">
						{{item.value}}
						<!-- <text v-if="index == 0"  @tap="copySerial(item.value)"
							  class="font-sm d-inline-block px-1 ml-1 text-center" style="border: 1rpx solid #666666;">
							复制
						</text> -->
					</view>
				</view>
			</view>
			<z-cut/>
			<view class="p-2 d-flex j-sb">
				<view class="">支付金额</view>
				<view class="" style="color: #666666;">实付款<text class="ml-1" style="color: #dd5a47;font-weight: 600;">￥{{allPrice}}</text></view>
			</view>
		</view>
		<view class="position-fixed left-0 right-0 bottom-0 pr-2 d-flex j-end a-center" 
			  style="height: 80rpx;background: #FFFFFF;box-shadow: 0 -3upx 3upx 0 #F0F0F0;">
			<view class="text-fff px-2 py-1 main-bg-color" style="border-radius: 50rpx;" 
				  :style="{background: currentIndex == 0 ? '#4566f3' : '#999999'}"	@tap="submit">
				立即付款
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	import cut from '@/components/common/cut.vue'
	import goods from '@/components/common/goods_item.vue'
	import { getOrderDetail } from '../../service/order.js'
	export default{
		components:{
			"z-navbar": navbar,
			"z-cut": cut,
			"z-goods-item": goods
		},
		data(){
			return{
				flowList: ['待付款','待核销','已核销'],
				nums: 0,
				address: {},
				time: '',
				allPrice: 0.00,
				currentIndex: 0,
				orderList: [],
				goodsLists: [],
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			submit(){
				if(this.currentIndex != 0){
					return
				}else{
					uni.setStorage({
						key: 'order_id',
						data: this.order_id,
						success: res =>{
							uni.navigateTo({
								url: 'pay'
							})
						}
					})
				}
			}
		},
		onLoad(option){
			this.nums = this.flowList.length*2 - 1;
			uni.getStorage({
				key: 'token',
				success: res =>{
					getOrderDetail(res.data,option.id).then(res =>{
						this.time = res.data.data.add_time;
						const newTime = new Date(this.time).getTime();
						console.log(newTime)
						this.goodsLists = res.data.data.goods_info;
						this.allPrice = res.data.data.amount;
						this.order_id = res.data.data.order_no;
						this.orderList.push({name: '订单编号',value: res.data.data.order_no});
						this.orderList.push({name: '下单时间',value: res.data.data.add_time});
						this.orderList.push({name: '支付方式',value: '微信支付'});
						if(option.index == 0){
							this.currentIndex = 0;
							this.orderList.push({name: '支付状态',value: '未支付'});
						}else if(option.index == 1){
							this.currentIndex = 2;
							this.orderList.push({name: '支付状态',value: '已支付'});
						}else if(option.index == 2){
							this.currentIndex = 4;
							this.orderList.push({name: '支付状态',value: '已支付'});
						}
						this.address = res.data.data.address;
						console.log(res)
					})
				}
			})
		}
	}
</script>

<style>
	.dot.circle{
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: center;
		width: 15rpx;
		height: 15rpx;
		border-radius: 50%;
		border: 1rpx solid #999999;
		box-shadow: 2rpx 2rpx 5rpx #CCCCCC;
	}
	.dot view{
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		align-self: center;
		background: #666666;
		box-shadow: 2rpx 2rpx 5rpx #CCCCCC;
	}
	.circle view{
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		align-self: center;
		background: #f7303b;
		box-shadow: 2rpx 2rpx 5rpx #CCCCCC;
	}
	.order_detail .goods-title .ellipsis{
		width: 80%; 
	}
</style>
