<template>
	<view class="" style="background: #F7F7F7;min-height: 100%;">
		<z-navbar bgColor='#ffffff' titleColor='#333333' title='申请提现'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo2 position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 46rpx; z-index: 9999;">
				</view>
			</template>
			<template slot="right">
				<view class="position-absolute font-md" style="right: 15rpx; top: 46rpx; z-index: 9999;" @tap="goToPrice">
					提现纪录
				</view>
			</template> 
		</z-navbar>
		<view class="pt-2" style="margin-top: 130rpx;background: #F7F7F7;">
			<view class="p-2" style="background: #FFFFFF;box-sizing: border-box;">
				<input style="width: 100%;" type="text" v-model="account" value="" placeholder="请输入微信号"/>
			</view>
			<view class="mt p-2" style="background: #FFFFFF;box-sizing: border-box;">
				<input style="width: 100%;" type="text" value="" v-model="nickname" placeholder="请输入提现账户对应的昵称"/>
			</view>
			<view class="mt-2 p-2" style="background: #FFFFFF;box-sizing: border-box;">
				<input style="width: 100%;" type="text" value="" v-model="money" placeholder="请输入提现金额,不得少于50元"/>
			</view>
			<view class="font p-2" style="color: #777777;">
				<text>可提现金额：</text>
				<text class="font-lg" style="color: #dd5a47;">{{price}}</text>元
			</view>
			<view class="deposit_sub" @tap="submit">确认提现</view>
			<view class="">
				<view class="font p-2" style="color: #555555;">
					<text>提现备注：</text>
				</view>
				<view class="p-2" style="color: #777777;">
					1、申请提现后，提现金额会于1~2个工作日打到您的账户；<br>
					2、请认认真真写提现信息，提现账户要与账户昵称一一对应，工作人员会加您好友，并以转账的形式，将提现金额打到您得到账户
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from '../../components/common/navbar.vue'
	import { getMyData, getPrice } from '../../service/my.js'
	import { getStorge } from '../../common/packaging_storge/storge.js'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return{
				price: '',
				account:'',
				nickname:'',
				money:''
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			goToPrice(){
				uni.navigateTo({
					url: 'price_jilu'
				})
			},
			submit(){
				const account = this.account;
				const nickname = this.nickname;
				const money = this.money;
				const price = this.price;
				const token = getStorge('token')
				if(money < 50){
					this._showToast('提现金额不能小于50')
				}
				if(price  <  money){
					this._showToast('您的余额不足')
				}
				if(token){
					getPrice(token,money,account,nickname).then(res =>{
						if(res.data.status == 200){
							this._showToast(res.data.msg)
							setTimeout(() =>{
								uni.navigateTo({
									url: 'price_jilu'
								})
							},600)
						}else{
							this._showToast(res.data.msg)
						}
					})
				}
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
			const token = getStorge('token')
			if(token){
				getMyData(token).then(res =>{
					const price = parseFloat(res.data.data.balance);
					this.price = price.toFixed(2)
				})
			}
		}
	}
</script>

<style>
	.deposit_sub{
		width: 710upx;
		margin: 100upx auto 20upx;
		padding: 20upx 0; 
		color: #FFFFFF;
		font-size: 32upx;
		text-align: center;
		background: rgb(69, 102, 243);
		border-radius: 20upx;
	}
</style>
