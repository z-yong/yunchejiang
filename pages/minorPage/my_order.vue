<template>
	<view class="h-100 my_order" style="background: #F7F7F7;">
		<z-navbar title='我的订单'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo position-absolute text-fff" @tap="goBack"
					  style="left: 15rpx; top: 48rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view class="" style="margin-top: 130rpx;">
			<view class="p-3 pt-0 main-bg-color position-relative" style="padding-bottom: 100rpx;">
				<view class="text-fff" style="font-weight: 600;">订单信息</view>
				<view class="">
					<view class="d-flex mt text-fff font">
						<view class=""><text>已消费订单:</text><text>{{' ' + num}}</text></view>
						<view class="ml-2"><text>总消费:</text><text>￥{{allPrice}}</text></view>
					</view>
				</view>
				<view class="position-absolute d-flex j-ar" 
					  style="bottom: -60rpx;left: 50%; width: 710rpx; height: 120rpx; background: #FFFFFF; transform: translate(-50%,0); box-sizing: border-box;border-radius: 10rpx;">
					<view v-for="(item,index) in menuList" :key='index' class="span-5 px-4" @tap="changeMenu(index)">
						<view class="h-100 d-flex flex-column j-center a-center" :style="{'border-bottom': currentIndex == index ? '4rpx solid #3fc21c' : 'none'}">
							<view class="">{{item.title}}</view>
							<view class="px-3">{{item.num}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="margin-top: 80rpx;">
				<view v-for="(item,index) in orderLists" :key='index' class="">
					<view class="p-2" style="width: 710rpx;margin: auto;border-radius: 10rpx; background: #FFFFFF; box-sizing: border-box;">
						<view class="d-flex j-sb main-border-bottom">
							<view class="">{{item.add_time}}</view>
						</view>
						<z-goods-item classify :goodsList='item.goods' isFlex isOrder isOrderDetail @goToOrderDetail='toOrderDetail(item.id)'/>
						<view class="d-flex j-end py-2"> 
							<text>实际付款<text style="font-weight: 600; color: #dd5a47;">￥{{item.money}}</text></text>
						</view>
						<view class="text-center d-flex j-end font">
							<view v-if="currentIndex == 0" class="mr-2 px-2 py-1" @tap="deleteOrder(item.id)"
								  style="color: #888888; border-radius: 50rpx;border: 1rpx solid #F0F0F0;">
								取消订单
							</view>
							<view v-if="currentIndex == 0" class="text-fff px-2 py-1 main-bg-color" 
								  @tap="submit(item.order_no)" style="border-radius: 50rpx;">
								{{text == '待付款' ? '立即付款' : '确认收获'}}
							</view>
						</view>
					</view>
					<z-cut/>
				</view>
				<view v-if="orderLists.length == 0" class="text-center mt-4">
					<image style="width: 60%;" src='../../static/noOrder.png' mode="widthFix"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	import goods from '@/components/common/goods_item.vue'
	import cut from '@/components/common/cut.vue'
	
	import { getOrderData, getOrderNum, deleteOrder } from '../../service/order.js'
	export default{
		components:{
			"z-navbar": navbar,
			"z-goods-item": goods,
			"z-cut": cut
		},
		data(){
			return{
				num: 0,
				allPrice: 0,
				currentIndex: 0,
				text: '待付款',
				menuList: [
					{title: '待付款',num: 0},
					{title: '待核销',num: 0},
					{title: '已核销',num: 0},
				],
				orderLists: []
			}
		},
		methods:{
			goBack(){
				uni.reLaunch({
					url: '../my/my'
				})
			},
			submit(id){
				uni.setStorage({
					key: 'order_id',
					data: id,
					success: res =>{
						uni.navigateTo({
							url: 'pay'
						})
					}
				})
			},
			deleteOrder(id){
				uni.showModal({
					title: '提示',
					content: '确认取消此订单？',
					success: res =>{
						if(res.confirm){
							uni.getStorage({
								key: 'token',
								success: res =>{
									deleteOrder(res.data,id).then(res =>{
										if(res.data.status == 200){
											this._getData(this.currentIndex);
										}
									})
								}
							})
						}
					}
				})
			},
			changeMenu(index){
				if(this.currentIndex != index){
					this.currentIndex = index;
					this._getData(index)
				}
			},
			toOrderDetail(id){
				uni.navigateTo({
					url: '/pages/minorPage/order_detail?id='+id+'&index='+this.currentIndex
				})
			},
			_getData(id){
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						uni.getStorage({
							key: 'user_id',
							success: res =>{
								getOrderData(token,res.data,id).then(res =>{
									if(res.data.status == 200){
										this.orderLists = res.data.data
									}
								})
								getOrderNum(token,res.data).then(res =>{
									this.allPrice = res.data.data.money;
									this.menuList[0].num = res.data.data.status1;
									this.menuList[1].num = res.data.data.status2;
									this.menuList[2].num = res.data.data.status3;
									this.num = res.data.data.xorder
								})
							}
						})
					}
				})
			}
		},
		onLoad(option){
			this.currentIndex = option.index;
			if(option.order_id){
				this.currentIndex = 1
			}
			this._getData(this.currentIndex)
		}
	}
</script>

<style>
	.my_order .order-goods-box{
		padding: 0 20upx;
	}
	.my_order .gg{
		/* #ifdef H5 */
		width: 400upx;
		display: flex !important;
		justify-content: space-between !important;
		/* #endif */
	}
	.my_order .goods-title>.ellipsis{
		max-width: 80%;
	}
</style>
