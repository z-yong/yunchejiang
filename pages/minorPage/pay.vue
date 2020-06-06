<template>
	<view class="pay-wrapper">
		<!-- <z-navbar bgColor='#ffffff' titleColor='#333333' title='填写订单'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo1 position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 35rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar> -->
		<view class="" style="padding-bottom: 100rpx;">
			<view class="font-md">
				<view class="d-flex p-2 j-sb a-center" @tap="setAddress">
					<view v-if="address == ''"  class="">设置收货地址</view>
					<view v-else class="">
						<view class="">
							<text style="font-weight: 600;">{{address.name}}</text>
							<text class="ml-2" style="font-weight: 600;">{{address.tel}}</text>
						</view>
						<view class="font mt-1" style="color: #666666;">{{address.address}}</view>
					</view>
					<view class="iconfont icon-xiangyou font-lg"></view>
				</view>
			</view>
			<z-cut/>
			<view class="">
				<view class="p-2 main-border-bottom font-md">
					<view class="">共<text class="mx" style="color: #dd5a47;">{{goodsLists.length}}</text>种商品</view>
				</view>
				<z-goods-item classify :goodsList='goodsLists' isFlex isOrder/>
			</view>
			<z-cut/>
			<view class="d-flex p-2 j-sb font-md a-center main-border-bottom" @tap="openCoupon">
				<view class="">优惠券</view>
				<view class="d-flex a-center">
					<text :style="{color: couponText == '请选择' ? '#888888' : '#f1452f'}">{{couponText}}</text>
					<text class="ml-1 iconfont icon-xiangyou font-lg"></text>
				</view>
			</view>
			<!-- <view class="d-flex a-center p-2 main-border-bottom font-md">
				<view class="">送达日期</view>
				<view class="ml-2" style="color: #999999;">2019-10</view>
			</view> -->
			<view class="p-2 main-border-bottom font-md">
				<view class="">备注信息</view>
				<textarea style="width: 100%; height: 140rpx; background: #F9F9F9; box-sizing: border-box;" class="mt-1 p-2" 
						  v-model="remark" placeholder="请添加备注(150字以内)"/>
			</view>
			<z-cut/>
			<view class="p-2 main-border-bottom font-md">
				<view class="">支付方式</view>
				<view class="text-center mt-2">
					<view class="d-flex a-center py-2 main-border" :class="isWeixin ? 'active-pay' : ''" @tap="selectWei" style="box-sizing: border-box;">
						<view class="w-50">
							<text class="iconfont icon-weixin2 font-lg animated" style="color: #3bb338;" :class="isWeixin ? 'bounce': ''"></text>
							<text class="text ml-1 animated" :class="isWeixin ? '': 'bounce'">微信支付</text>
						</view>
						<view class="main-border-left w-50 font" style="color: #999999;">
							微信快捷支付
						</view>
					</view>
					<view class="d-flex a-center mt-1 py-2 main-border" :class="isWeixin ? '' : 'active-pay'" @tap="selectYu" style="box-sizing: border-box;">
						<view class="w-50">
							<text class="iconfont icon-yue1 font-lg animated" style="color: #fe9313;" :class="isWeixin ? '': 'bounce'"></text>
							<text class="text ml-1">余额支付</text>
						</view> 
						<view class="main-border-left w-50 font" style="color: #999999; font">
							可用余额{{yue}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="text-center d-flex j-sb py-1 px-2 a-center position-fixed footer">
			<view class="d-flex a-center font-lg">
				<text>合计</text>
				<text class="ml-1" style="color: #dd5a47;">￥{{allPrice}}</text>
			</view>
			<view class=""  @tap="payOrder">
				<view class="main-bg-color text-fff" style="border-radius: 80rpx; padding: 15rpx 50rpx;">立即结算</view>
			</view>
		</view>
		<!-- 上拉菜单 -->
		<z-popup ref='popup'>
			<view class="d-flex j-sb">
				<view class=""> </view>
				<view class="font-md" style="font-weight: 600;">{{popupTitle}}</view>
				<view class="iconfont icon-guanbi1" style="color: #999999;" @tap="closeAddress"></view>
			</view>
			<view v-if="isAddress" class="p-2 mt-4">
				<view v-if="!addressList.length" class="" style="color: #999999;">还没有收获地址，去添加...</view>
				<view v-for="(item,index) in addressList" :key='index' class="mt-3 d-flex a-center j-sb" 
					  :style="{color: item.active ? '#dd5a47' : ''}" @tap="selectAddress(item)">
					<view class="">
						<view class="">
							<text style="font-weight: 600;">{{item.name}}</text>
							<text class="ml-2" style="font-weight: 600;">{{item.tel}}</text>
						</view>
						<view class="font" :style="{color: item.active ? '#dd5a47' : '#666666'}"><text class="iconfont icon-ditu4"></text>{{item.address}}</view>
					</view>
					<view v-if="item.active" class="iconfont icon-zhengque"></view>
				</view>
				<view class="mt-4 text-center">
					<view class="main-bg-color text-fff py-2" style="border-radius: 50rpx;" @tap="goToAddress">编辑收获地址</view>
				</view>
			</view>
			<view v-if="!isAddress" class="">
				<view v-if="!couponList.length" class="p-2 mt-2 text-center" style="overflow: hidden;">
					<image style="width: 400rpx;" src="../../static/noCoupon.png" mode="widthFix"></image>
				</view>
				<z-coupon :list='couponList' isPay @tapCoupon='selectCoupon($event)'/>
			</view>
		</z-popup>
	</view>
</template>

<script>
	import cut from '@/components/common/cut.vue'
	import goodsItem from '@/components/common/goods_item.vue'
	import popup from '@/components/common/uni-popup.vue'
	import coupon from '@/components/common/coupon.vue'
	import { getMyData } from '../../service/my.js'
	import { getOrderData, getAddressList, getIdAddress, submitOrder } from '../../service/pay.js'
	import navbar from '@/components/common/navbar.vue'
	export default{
		components:{
			"z-cut": cut,
			"z-goods-item": goodsItem,
			"z-popup": popup,
			"z-navbar": navbar,
			"z-coupon": coupon
		},
		data(){
			return{
				remark: '',
				isAddress:false,
				address: '',
				amount: 0.00,
				addressList: [],
				couponText: '请选择',
				isWeixin: true,
				goodsLists: [],
				allPrice: 0.00,
				popupTitle: '',
				coupon_money: 0.00,
				coupon_id: '',
				data: '',
				order_id: '',
				yue: 0.00,
				couponList: []
			}
		},
		methods:{
			goBack(){
				uni.reLaunch({
					url: '../cart/cart'
				})
			},
			selectCoupon(e){
				this.$http.post('/api-user/shop-use-coupon',{coupon_id: e.id,amount:this.amount,status:e.status},{token:true,msg:true}).then(res =>{
					this._getCoupon();
					this._getData();
					setTimeout(() =>{
						this.$refs.popup.close()
					},200)
				}).catch(err =>{
					console.log(err)
				})
			},
			setAddress(){
				this.isAddress = true;
				this.popupTitle = '选择地址'
				this.$refs.popup.open()
				uni.getStorage({
					key: 'token',
					success: res =>{
						getAddressList(res.data).then(res =>{
							if(res.data.status == 200){
								this.addressList = res.data.data;
								this.addressList.forEach((ele) =>{
									if(ele.id == this.address.id){
										ele.active = true;
									}else{
										ele.active = false
									}
								})
							}
						})
					}
				})
			},
			openCoupon(){
				this.isAddress = false;
				this.popupTitle = '优惠券'
				this.$refs.popup.open()
			},
			closeAddress(){
				this.$refs.popup.close()
			},
			selectAddress(item){
				this.addressList.forEach((ele,index) =>{
					if(item.id == ele.id){
						ele.active = true;
						this.address = ele;
					}else{
						ele.active = false;
					}
				})
				this.$refs.popup.close()
			},
			goToAddress(){
				uni.navigateTo({
					url: 'address'
				})
				this.$refs.popup.close()
			},
			selectWei(){
				this.isWeixin = true;
			},
			selectYu(){
				this.isWeixin = false;
				
			},
			payOrder(){
				const _this = this;
				let way;
				if(this.isWeixin){
					way = 'weixin'
				}else{
					way = 'yue'
				}
				const arr = [];
				this.goodsLists.forEach(ele =>{
					arr.push(ele.cid)
				})
				if(this.address.id){
					uni.getStorage({
						key: 'token',
						success: res =>{
							let a;
							if(this.isWeixin){
								a = 1
							}else{
								a = 2
							}
							submitOrder(res.data,this.address.id,this.order_id,this.allPrice,this.remark,a,this.coupon_id,this.coupon_money).then(res =>{
								if(a == 1){
									const data = res.data;
									if(!WeixinJSBridge){
										if( document.addEventListener ){
											document.addEventListener('WeixinJSBridgeReady', function(){
													_this._onBridgeReady(data)
												}, false);
										} else if (document.attachEvent){
											document.attachEvent('WeixinJSBridgeReady', function(){ _this._onBridgeReady(data) });
											document.attachEvent('onWeixinJSBridgeReady', function(){ _this._onBridgeReady(data) });
										}
									}else{
										this._onBridgeReady(data)
									}
								}else{
									if(res.data.status == 200){
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
										setTimeout(() =>{
											uni.navigateTo({
												url: 'my_order?order_id='+this.order_id
											})
										},600)
									}else{
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										})
									}
								}
							})
						}
					})
				}else{
					uni.showToast({
						title: "您还未选择地址",
						icon: 'none'
					})
				}
			},
			 _getCoupon(){
				 const store_id = this.getStorge('user_id')
			 	this.$http.post('/api-user/shop-my-coupon',{type:1,store_id},{token:true}).then(res =>{
			 		this.couponList = res
			 	})
			 },
			  //////////// 微信接口实例
			_onBridgeReady(data){
				// 调用微信接口
				  if(WeixinJSBridge){
					WeixinJSBridge.invoke(
					    'getBrandWCPayRequest', {
					          "appId": data.appId,     //公众号名称，由商户传入     
					          "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
					          "nonceStr": data.nonceStr, //随机串     
					          "package":data.package,    // 统一下单接口返回的prepay_id 参数值 
					          "signType":data.signType,         //微信签名方式：     
					          "paySign": data.paySign //微信签名 
					    },
					    function(res){
					        if(res.err_msg == "get_brand_wcpay_request:ok" ){
					              // 使用以上方式判断前端返回,微信团队郑重提示：
					              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
					             uni.navigateTo({
					             	url: 'my_order?order_id='+this.order_id
					             })
							}
					     }
					);
				}
			},
			_getYue(token){
				getMyData(token).then(res =>{
					this.yue = res.data.data.balance;
				})
			},
			_getData(){
				this.order_id = this.getStorge('order_id')
				this.$http.post('/api-pay/order-detail',{order_num:this.order_id},{token:true}).then(res =>{
						this.goodsLists = res.goods_info;
						this.address = res.address;
						this.amount = res.amount
						this.allPrice = parseFloat(res.amount) - parseFloat(res.youhui);
						this.allPrice = this.allPrice.toFixed(2);
						this.coupon_money = res.youhui;
						this.coupon_id = res.coupon_id;
						if(this.coupon_id){
							this.couponText = '-'+this.coupon_money;
							console.log(this.couponText);
						}else{
							this.couponText = '请选择'
						}
				})
			}
		},
		onWeixinJSBridgeReady(){
			this._onBridgeReady(this.data)
		},
		onLoad(option){
			const token = this.getStorge('token');
			this._getYue(token);
			this._getCoupon()
			this._getData()
			if(option.id){
				getIdAddress(token,option.id).then(res =>{
					this.address = res.data.data;
				})
			}
		}
	}
</script>

<style>
	.navbar .nav-box{
		display: flex;
		align-items: center;
	}
	.nav-box .icon-xiangzuo1{
		margin: 15upx 0 0 15upx;
	}
	.pay-wrapper .pay-goods-box{
		padding: 0 20upx;
	}
	.pay-wrapper .gg{
		/* #ifdef H5 */
		width: 460upx;
		display: flex !important;
		justify-content: space-between !important;
		/* #endif */
	}
	.pay-wrapper .goods-title>.ellipsis{
		max-width: 80%;
	}
	.active-pay{
		border: 2rpx solid #dd5a47;
	}
	.active-pay .text{
		color: #3fc21c;
	}
	.pay-wrapper .footer{
		height: 100rpx;
		box-sizing: border-box;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFFFFF;
		z-index: 997;
		box-shadow: 0 -3upx 3upx 0 #F0F0F0;
	}
</style>
