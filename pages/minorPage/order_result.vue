<template>
	<view class="px-2 h-100" style="background: #F7F7F7;padding-top: 200rpx; box-sizing: border-box;">
		<z-navbar bgColor='#ffffff' titleColor='#333333' title='支付结果'/>
		<view class="position-relative" style="background: #FFFFFF; padding: 80rpx 0 30rpx;border-radius: 10rpx;margin-top: 130rpx;">
			<view class="position-absolute" 
				  style="overflow: hidden; border-radius: 50%; width: 120rpx; height: 120rpx; top: -50rpx; left: 50%; transform: translate(-50%,0);">
				<image class="w-100 h-100" src='../../static/img/gougou.png'></image>
			</view>
			<view class="text-center" style="font-weight: 600;">支付完成</view>
			<view v-for="(item,index) in orderList" :key='index' class="d-flex j-sb p-2 px-3">
				<view class="">{{item.name}}</view>
				<view class="" style="color: #666666;">{{item.value}}</view>
			</view>
			<view class="px-2 mt-3">
				<navigator open-type="reLaunch" url="../index/index" @tap="goIndex" class="main-bg-color text-center text-fff " style="padding: 20rpx 0;border-radius: 50rpx;">返回首页</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	// import { getAllCartNum } from '../../service/cart.js'
	import { orderResult } from '../../service/pay.js'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return{
				orderList: []
			}
		},
		methods:{
			goIndex(){
				uni.removeTabBarBadge({
					index: 3
				})
				this._getAllCartNum()
			},
			// 设置总数量
			_getAllCartNum(){
				uni.getStorage({
					key: 'UID',
					success: res =>{
						getAllCartNum(res.data).then(res =>{
							console.log(res)
							const cartNum = String(res.data.data);
							uni.setStorage({
								key: 'cartNum',
								data: cartNum
							})
							if(res.data.data != 0){
								uni.setTabBarBadge({
								  index: 3,
								  text: cartNum
								})
							}
						})
					}
				})
			},
		},
		onLoad(option){
			if(option.order_id){
				orderResult(option.order_id).then(res =>{
					this.orderList.push({name: '订单编号',value: res.data.data.order_id});
					this.orderList.push({name: '下单时间',value: res.data.data.add_time});
					this.orderList.push({name: '支付方式',value: res.data.data.pay_type});
					this.orderList.push({name: '支付金额',value: res.data.data.pay_price});
				})
			}
		}
	}
</script>

<style>
</style>
