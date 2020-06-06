<template>
	<view class="my-wrapper">
		<z-navbar title='我的'></z-navbar>
		<view class="my-head">
			<view class="my-mess j-center">
				<!-- <view class="auth">
					<view class="auth-text">
						认证
						<image class="my-icon" src="/static/my/auth.png" mode="widthFix"></image>
					</view>
				</view> -->
				<view class="head-photo">
					<image src="/static/my/head.png" mode="widthFix"></image>
				</view>
				<!-- <view class="sign">
					<view class="sign-text">
						<image class="my-icon" src="/static/my/sign.png" mode="widthFix"></image>
						签到
					</view>
				</view> -->
			</view>
			<view class="head-mess box-shadow">
				<view class="my-name">{{name}}</view>
				<!-- <view class="my-email">1233354qq.com</view> -->
				<view class="head-last main-border-top">
					<view class="balance">
						<view class="num">{{price}}</view>
						<view class="last-text">余额</view>
					</view>
					<view class="roll" @tap="goCoupon">
						<view class="num">{{coupon_num}}</view>
						<view class="last-text">优惠券</view>
					</view>
				</view>
			</view>
			<view class="order box-shadow m-auto">
				<view class="order-title main-border-bottom">
					<view class="title list-title">我的订单</view>
					<!-- <view class="see-all">
						<text>查看全部订单</text>
						<text class="iconfont icon-xiangyou"></text>
					</view> -->
				</view>
				<view class="order-content">
					<view class="order-item" v-for="(item,index) in orderList" :key='index' @tap="goToOrder(item,index)">
						<image :src="item.img" mode="widthFix"></image>
						<view class="item-text">{{item.title}}</view>
					</view>
				</view>
			</view>
			<view class="" style="padding-bottom: 100rpx;">
				<z-line-list title='我的服务' :safetyList='safetyList'/>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from "@/components/common/navbar.vue"
	import lineList from "@/components/common/lineList.vue"
	
	import { getMyData } from '../../service/my.js'
	export default{
		components:{
			"z-navbar": navbar,
			"z-line-list": lineList
		},
		data(){
			return {
				price: 0.00,
				name: '',
				coupon_num: 0,
				orderList: [
					{img: "/static/my/waitfu.png", title: '商城待付款'},
					{img: "/static/my/waitfa.png", title: '商城待核销'},
					{img: "/static/my/waitshow.png", title: '商城已核销'}
				],
				safetyList: [
					{img: "/static/my/youhui.png", title: '优惠活动'},
					{img: "/static/my/youhui.png", title: '中奖纪录'},
					{img: "/static/my/youhui.png", title: '活动纪录'},
					{img: "/static/my/youhui.png", title: '佣金纪录'},
					{img: "/static/my/youhui.png", title: '申请提现'},
					{img: "/static/my/youhui.png", title: '账号设置'}
					// {img: "/static/my/zhanghao.png", title: '账号安全'},
					// {img: "/static/my/shiming.png", title: '实名认证', desc: '已认证'}
				]
			}
		},
		methods:{
			goToOrder(item,index){
				uni.navigateTo({
					url: '../minorPage/my_order?index='+index
				})
			},
			goCoupon(){
				uni.navigateTo({
					url: '../minorPage/coupon?path=my'
				})
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			_getData(){
				const store_id = this.getStorge('user_id');
				const token = this.getStorge('token')
				getMyData(token,store_id).then(res =>{
					this.price = res.data.data.balance;
					this.name = res.data.data.realname;
					this.coupon_num = res.data.data.coupon_num;
				})
			}
		},
		onLoad(){
			
		},
		onShow(){
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
			this._getData()
		}
	}
</script>

<style>
	.my-wrapper .my-head{
		position: relative;
		width: 100%;
		height: 220upx;
		margin-top: 140upx;
		background: #4566f3;
	}
	.my-head .my-mess{
		position: relative;
		display: flex;
		width: 440upx;
		margin: auto;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}
	.my-head .my-icon{
		position: absolute;
		top: 50%;
		width: 55upx;
		height: 55upx;
		border-radius: 50%;
		transform: translate(0,-50%);
	}
	.my-head .my-mess .head-photo{
		width: 145upx;
		height: 145upx;
	}
	.my-head .my-mess .head-photo image{
		width: 145upx;
		height: 145upx;
		border-radius: 50%;
	}
	.my-mess .auth,
	.my-mess .sign{
		display: flex;
		align-items: center;
	}
	.my-mess .auth-text,
	.my-mess .sign-text{
		position: relative;
		display: inline-block;
		font-size: 25upx;
		color: #4566F3;
		border: 2upx solid #6e88f5;
		border-radius: 50upx;
		background: #f3f3f3;
	}
	.my-mess .auth-text{
		border-right: none;
		padding: 0 35upx 0 15upx;
	}
	.my-mess .auth-text .my-icon{
		right: -25upx;
	}
	.my-mess .sign-text{
		border-left: none;
		padding: 0 15upx 0 35upx;
	}
	.my-mess .sign-text .my-icon{
		left: -25upx;
	}
	.my-wrapper .head-mess{
		position: absolute;
		top: 72.5upx;
		left: 50%;
		width: 690upx;
		transform: translate(-50%,0);
		background: #FFFFFF;
		z-index: 1;
		border-radius: 20upx;
		padding-top: 80upx;
	}
	.my-wrapper .head-mess .my-name{
		font-size: 35upx;
		text-align: center;
	}
	.my-wrapper .head-mess .my-email{
		font-size: 32upx;
		text-align: center;
		color: #9a9a9a;
	}
	.my-wrapper .head-mess .head-last{
		display: flex;
		justify-content: space-between;
		margin-top: 20upx;
	}
	.my-wrapper .head-mess .head-last .balance{
		border-right: 1upx solid #F0F0F0;
	}
	.my-wrapper .head-mess .head-last .roll{
		border-left: 1upx solid #F0F0F0;
	}
	.my-wrapper .head-mess .head-last>view{
		width: 215upx;
		height: 105upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.head-last .num{
		color: #7b7b7b;
		font-size: 32upx;
	}
	.head-last .last-text{
		color: #BBBBBB;
		font-size: 30upx;
	}
	.my-wrapper .order{
		margin: 240upx auto 0;
	}
	.my-wrapper .order .order-title{
		display: flex;
		padding: 30upx 0upx 15upx 20upx;
		justify-content: space-between;
		align-items: center;
	}
	.order .order-title .see-all{
		display: flex;
		align-items: center;
		font-size: 28upx;
		color: #aeaeae;
	}
	.order .order-title .iconfont{
		margin-left: 6upx;
	}
	.order .order-content{
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 20upx 0;
	}
	.order-content .order-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: #AEAEAE;
	}
	.order-content .order-item image{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
	}
	.order-content .order-item .item-text{
		margin-top: 10upx;
	}
</style>
