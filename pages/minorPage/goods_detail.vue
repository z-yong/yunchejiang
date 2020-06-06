<template>
	<view class="mt-3" style="padding-bottom: 100rpx;">
		<view class="position-relative">
			<z-banner :banner='bannerList'/>
			<view class="position-absolute" style="left: 20upx; top: 40upx;" @tap="goToBack">
				<text class="iconfont icon-xiangzuo4 font-lg"></text>
			</view>
		</view>
		<view class="p-2">
			<view class="font-lg">{{title}}</view>
			<text class="font-sm" style="color: #ff965d;background: #fff7f3;">{{desc}}</text>
			<view class="d-flex flex-column j-center">
				<!-- <text class="font-sm">/{{unit}}</text> -->
				<view style="height: 35upx; font-size: 30upx;" class="main-text-color">￥{{price}}</view>
				<!-- <view class="line-through font-sm" style="color: #c1c1c1; margin-left: 4upx;">￥{{out_price}}</view> -->
			</view>
		</view>
		<!-- 分割线 -->
		<view class="" style="background: #F7F7F7;height: 20upx;"></view>
		<view class="d-flex p-2 j-sb font-md a-center main-border-bottom" @tap="goCoupon">
			<view class="d-flex a-center"><text class="font-md">优惠券</text> <text class="font ml" style="color: #777777;">(结算时可使用)</text> </view>
			<view class="d-flex a-center">
				<text class="ml-1 iconfont icon-xiangyou font-lg"></text>
			</view>
		</view> 
		<!-- 分割线 -->
		<view class="" style="background: #F7F7F7;height: 20upx;"></view>
		<view class="">
			<z-title-com title='服务保障'/>
			<view class="pl-2">
				<view v-for="(serve,i) in serveList" :key='i' class="d-flex p-2">
					<view class="">
						<image :src="serve.icon" mode="widthFix" style="width: 35upx;"></image>
					</view>
					<view class="ml-2">
						<view class="font-md" style="color: #333;">{{serve.name}}</view>
						<view class="" style="color: #999;">
							<view v-for="(d,ii) in serve.content" :key='ii' class="">{{d}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 分割线 -->
		<view class="" style="background: #F7F7F7;height: 20upx;"></view>
		<!-- 图文介绍 -->
		<z-title-com title='图文介绍'/>
		<view style="overflow: hidden;box-sizing: border-box;width: 710rpx; margin: auto;">
			<rich-text :nodes="description" style="overflow: hidden;"></rich-text>
		</view>
		<!-- 推荐列表 -->
		<!-- <view class="mt-3" style="padding-bottom: 150upx;">
			<view class="font-md pl-2 mb-2" style="font-size: 36upx;">优惠推荐</view>
			<z-goods-list :goodsList='recommedList'/>
		</view> -->
		<view class="detail-footer d-flex j-sb a-center text-center position-fixed">
			<view class="d-flex j-center a-center font-md" style="width: 24%; color: #adadad;">
				<navigator open-type="reLaunch" url="../cart/cart" class="position-relative d-flex flex-column j-center a-center">
					<image style="width: 35upx; height: 32upx;" src="/static/car.png"></image>
					<view class="">购物车</view>
					<view v-if="cartNum != 0 || cartNum != null" class="position-absolute main-bg-color text-fff text-center px-1" 
						  style="border-radius: 100%; line-height: 30rpx; font-size: 20rpx;right: -15rpx; top: -8rpx;">
						{{cartNum}}
					</view>
				</navigator>
			</view>
			<view class="d-flex" style="width: 76%;">
				<view class="h-100 main-bg-color text-fff font-lg" style="width: 50%; line-height: 100upx;" @tap="addCart">加入购物车</view>
				<view class="h-100 text-fff font-lg" style="width: 50%; line-height: 100upx; background: #dd5a47;" @tap="buyGoods">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	import banner from '@/components/index/indexBg.vue' 
	import titleCom from '@/components/common/title.vue'
	import goodsList  from '@/components/common/recommend.vue'
	import { getGoodsDetail, addGoodsCart, directCreateOrder } from '../../service/detail.js'
	export default{
		components:{
			"z-banner": banner,
			"z-title-com": titleCom,
			"z-goods-list": goodsList
		},
		data(){
			return{
				id: 0,
				title: '',
				desc: '',
				price: '',
				cartNum: 0,
				description: '',
				// bannerHeight: 420,
				bannerList: [],
				serveList: [{icon: '/static/pei.png',name: '配送服务',content: ['该商品支持次日达']},
							{icon: '/static/shou.png',name: '售后服务',content: ['该商品支持签收6小时内质量问题可退换']},
							{icon: '/static/zhi.png',name: '支付方式',content: ['支持微信支付']},],
				recommedList: []
			}
		},
		methods:{
			goToBack(){
				uni.navigateBack({
					delta: 1
				})
			},
			goCoupon(){
				uni.navigateTo({
					url: 'coupon?path=goods_detail'
				})
			},
			addCart(){
				if(this.stock > 0){
					uni.getStorage({
						key: 'token',
						success: res =>{
							const token = res.data;
							uni.getStorage({
								key: 'user_id',
								success: res =>{
									addGoodsCart(token,res.data,this.id).then(res =>{
										if(res.data.status == 200){
											this.cartNum = res.data.data;
										}
										this._showToast(res.data.msg)
									})
								}
							})
						}
					})
				}else{
					this._showToast('对不起，该商品暂无库存！')
				}
			},
			buyGoods(){
				if(this.stock > 0){
					uni.getStorage({
						key: 'token',
						success: res =>{
							const token = res.data;
							uni.getStorage({
								key: 'user_id',
								success: res =>{
									directCreateOrder(token,res.data,this.id,this.price).then(res =>{
										if(res.data.status == 200){
											uni.setStorage({
												key: 'order_id',
												data: res.data.data,
												success: res =>{
													uni.navigateTo({
														url: '../minorPage/pay'
													})
												}
											})
										}
									})
								}
							})
						}
					})
				}else{
					this._showToast('对不起，该商品暂无库存！')
				}
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			}
		},
		onShow(){
			uni.getStorage({
				key: 'token',
				success: res =>{
					if(!res.data){
						this._showToast('请先登录');
						setTimeout(() =>{
							uni.navigateTo({
								url: 'login'
							})
						},300)
					}
				},
				fail: err =>{
					this._showToast('请先登录');
					setTimeout(() =>{
						uni.navigateTo({
							url: 'login'
						})
					},300)
				}
			})
		},
		onLoad(option){
			if(option.id){
				this.id = option.id;
			}
			uni.getStorage({
				key: 'token',
				success: res =>{
					if(res.data){
						getGoodsDetail(res.data,this.id).then(res =>{
							const reg = /<img/g;
							this.id = res.data.data.id;
							this.title = res.data.data.goods_name;
							this.desc = res.data.data.keywords;
							this.price = res.data.data.price;
							this.cartNum = res.data.data.car_num;
							this.stock = res.data.data.stock;
							this.description = res.data.data.description.replace(reg,"<img style='width:100%'");
							res.data.data.img.forEach(ele =>{
								this.bannerList.push({img: ele})
							})
						})
					}else{
						this._showToast('请先登录');
						setTimeout(() =>{
							uni.navigateTo({
								url: 'login'
							})
						},300)
					}
				},
				fail: err =>{
					this._showToast('请先登录');
					setTimeout(() =>{
						uni.navigateTo({
							url: 'login'
						})
					},300)
				}
			})
		}
	}
</script>

<style>
	.swiper-item{
		width: 100%;
		height: 100%;
	}
	.detail-footer{
		width: 100%;
		height: 100upx;
		background: #FFFFFF; 
		box-sizing: border-box;
		z-index: 9999;
		bottom: 0;
		box-shadow: 0 -3upx 3upx 0 #F0F0F0;
	}
</style>

