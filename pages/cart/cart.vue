<template>
	<view class="cart-wrapper">
		<!-- <z-navbar title='购物车'></z-navbar> -->
		<view class="p-2" style="font-weight: 600;font-size: 40rpx;">购物车</view>
		<view class="cart-list">
			<view class="cart-item" v-for="(item,index) in cartList" :key='index'>
				<view class="is-cart">
					<checkbox class="check" value="cb" :checked="item.check" @tap="changeCheck(item)"/>
				</view>
				<view class="cart-img">
					<image :src="item.picture" mode="widthFix"></image>
				</view>
				<view class="cart-text">
					<view class="cart-title">{{item.goods_name}}</view>
					<view class="cart-desc">{{item.keywords}}</view>
					<view class="price-box mt-2 d-flex j-sb a-center" style="height: 50upx;">
						<view class="price main-text-color" style="font-weight: 600;">￥{{item.price}}</view>
						<view class="change-num">
							<view class="minus" @tap="minusCart(item)">-</view>
							<view class="cart-num">{{item.car_num}}</view>
							<view class="add" @tap="addCart(item)">+</view>
						</view>
					</view>
				</view>
				<view class="delete" @tap="deleteCart(item)">
					<image src="/static/index/delete.png" mode="widthFix"></image>
				</view>
			</view>
			<view v-if="cartList.length == 0">
				<image src="../../static/kong.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="footer">
			<view class="foot-box">
				<view class="all-select d-flex a-center" @tap="allSelectCart">
					<checkbox class="check" value="cb" :checked="allSelect" />
					<text>全选</text>
				</view>
				<view class="foot-right">
					<view class="all-price">
						<text>总价:￥</text><text>{{allPrice}}</text>
					</view>
					<view class="submit" @tap="submit">
						提交订单
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from "@/components/common/navbar.vue"
	import { getCartData, addGoodsCart, reduceGoodsCart, deleteGoodsCart, createOrder } from '../../service/cart.js'
	import { getAllCartNum } from '../../service/index.js'
	export default{
		components: {
			"z-navbar": navbar
		},
		data(){
			return{
				cartList: [],
				allSelect: true,
				allPrice: 0.00
			}
		},
		methods:{
			changeCheck(item){
				item.check = !item.check;
				this._getAllPrice(this.cartList);
				if(this._isAllSelect()){
					this.allSelect = true;
				}else{
					this.allSelect = false;
				}
			},
			allSelectCart(){
				this.allSelect = !this.allSelect;
				if(this.allSelect){
					this.cartList.forEach(ele =>{
						ele.check = true;
					})
					this._getAllPrice(this.cartList)
				}else{
					this.cartList.forEach(ele =>{
						ele.check = false;
					})
					this.allPrice = 0
				}
			},
			addCart(item){
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						const store_id = res.data;
						uni.getStorage({
							key: 'token',
							success: res =>{
								addGoodsCart(res.data,store_id,item.id).then(res =>{
									if(res.data.status == 200){
										item.car_num = res.data.data;
										if(item.check){
											this.allPrice = (parseFloat(this.allPrice)+parseFloat(item.price)).toFixed(2)
										}
										this._getAllCartNum();
									}else{
										this._showToast(res.data.msg)
									}
								})
							}
						})
					}
				})
			},
			minusCart(item){
				if(item.car_num > 1){
					uni.getStorage({
						key: 'token',
						success: res =>{
							reduceGoodsCart(res.data,item.cart_id).then(res =>{
								if(res.data.status == 200){
									item.car_num --;
									if(item.check){
										this.allPrice = (parseFloat(this.allPrice)-parseFloat(item.price)).toFixed(2)
									}
									this._getAllCartNum();
								}else{
									this._showToast(res.data.msg)
								}
							})
						}
					})
				}
			},
			deleteCart(item){
				uni.showModal({
					title: '提示',
					content: '确定从购物车移除此商品?',
					success: res =>{
						if(res.confirm){
							uni.getStorage({
								key: 'token',
								success: res =>{
									deleteGoodsCart(res.data,item.cart_id).then(res =>{
										if(res.data.status == 200){
											this._showToast('移除成功');
											this._getData()
											this._getAllCartNum();
										}else{
											this._showToast(res.data.msg)
										}
									})
								}
							})
						}
					}
				})
			},
			submit(){
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						uni.getStorage({
							key: 'user_id',
							success: res =>{
								const ids = [];
								this.cartList.forEach((ele) =>{
									if(ele.check){
										ids.push(ele.cart_id)
									}
								})
								if(!ids.length){
									this._showToast('你还没有选择商品')
								}else{
									createOrder(ids,res.data,token,this.allPrice).then(res =>{
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
											this._getAllCartNum()
										}else{
											this._showToast(res.data.msg) 
										}
									})
								}
							}
						})
					}
				})
			},
			// 计算总价
			_getAllPrice(cartList){
				let price = 0
				cartList.forEach((ele,index) =>{
					if(ele.check){
						price += parseFloat(ele.price)*parseFloat(ele.car_num);
					}
				})
				this.allPrice = price.toFixed(2);
			},
			// 是否全选
			_isAllSelect(){
				let A = true;
				this.cartList.forEach(ele =>{
					if(!ele.check){
						A = false;
					}
				});
				return A
			},
			// 获
			_getAllCartNum(){
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						uni.getStorage({
							key: 'user_id',
							success: res =>{
								getAllCartNum(token,res.data).then(res =>{
									if(res.data.status == 200){
										const cartNum = String(res.data.data);
										console.log(cartNum)
										uni.setStorage({
											key: 'cartNum',
											data: cartNum
										})
										if(res.data.data != 0){
											uni.setTabBarBadge({
											  index: 2,
											  text: cartNum
											})
										}else{
											uni.removeTabBarBadge({
												index: 2
											})
										}
									}else{
											uni.removeTabBarBadge({
												index: 2
											})
										}
								})
							}
						})
					}
				})
			},
			_getData(){
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						const store_id = res.data;
						uni.getStorage({
							key: 'token',
							success: res =>{
								getCartData(res.data,store_id).then(res =>{
									this.cartList = [];
									if(res.data.data.length){
										res.data.data.forEach(ele =>{
											ele.goods_info.check = true;
											ele.goods_info.cart_id = ele.id;
											this.cartList.push(ele.goods_info)
										})
										console.log(res.data.data)
										this._getAllPrice(this.cartList)
									}
								})
							}
						})
					}
				})
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			}
		},
		onLoad(){
			
		},
		onShow(){
			this._getData();
			this._getAllCartNum();
			uni.getStorage({
				key: 'token',
				success: res =>{
					if(!res.data){
						this._showToast('请先登录');
						setTimeout(() =>{
							uni.navigateTo({
								url: '../minorPage/login'
							})
						},300)
					}
				},
				fail: err =>{
					this._showToast('请先登录');
					setTimeout(() =>{
						uni.navigateTo({
							url: '../minorPage/login'
						})
					},300)
				}
			})
		}
	}
</script>

<style>
	.cart-list{
		padding: 0 20upx 150upx;
	}
	.cart-list .cart-item{
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
		border-bottom: 1upx solid #f5f5f5;
	}
	.cart-list .cart-item .is-cart{
		width: 80upx;
	}
	.cart-list .cart-item .cart-img{
		width: 200upx;
		height: 200upx;
		text-align: center;
		display: flex;
		align-items: center;
	}
	.cart-list .cart-item .cart-img image{
		width: 80%;
	}
	.cart-item .cart-text{
		width: 430upx;
		padding: 0 20upx 0 20upx;
	}
	.cart-item .cart-text .cart-title{
		font-size: 30upx;
		margin-top: 15upx;
	}
	.cart-item .cart-text .cart-desc{
		font-size: 26upx;
		color: #999999;
		margin-top: 10upx;
	}
	.cart-item .cart-text .change-num view{
		display: inline-block;
		width: 50upx;
		height: 50upx;
		line-height: 50upx;
		text-align: center;
		border: 1upx solid #e5e5e5;
	}
	.cart-item .cart-text .change-num .minus,
	.cart-item .cart-text .change-num .num{
		border-right: none;
	}
	.cart-item .delete{
		position: absolute;
		top: 50upx;
		right: 20upx;
		width: 25upx;
	}
	.cart-item .delete image{
		width: 100%;
	}
	.cart-wrapper>.footer{
		width: 100%;
		position: fixed;
		background: #FFFFFF;
		bottom: 0;
		/* #ifdef H5 */
		bottom: 80upx;
		/* #endif */		
	}
	.footer .foot-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15upx 15upx 15upx 20upx;
		font-size: 35upx;
		background: #FFFFFF;
		z-index: 999;
	}
	.footer .foot-box .foot-right{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.foot-box .foot-right .all-price{
		color: #4566f3;
	}
	.foot-box .foot-right .submit{
		color: #FFFFFF;
		padding: 10upx 40upx;
		background: #4566f3;
		border-radius: 40upx;
		margin-left: 20upx;
	}
</style>
