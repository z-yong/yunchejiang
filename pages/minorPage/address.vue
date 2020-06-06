<template>
	<view class="">
		<!-- <z-navbar bgColor='#ffffff' titleColor='#333333' title='编辑收货地址'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo1 position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 42rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar> -->
		<view class="">
			<view v-if="addressList.length" v-for="(item,index) in addressList" :key='index' class="mt-2 p-2 d-flex j-sb a-center">
				<view class="" @tap="picthAddress(item)">
					<view class="">
						<text style="font-weight: 600;">{{item.name}}</text>
						<text class="ml-2" style="font-weight: 600;">{{item.tel}}</text>
					</view>
					<view class="font" style="color: #666666;"><text class="iconfont icon-ditu4"></text>{{item.address}}</view>
				</view>
				<view class="iconfont icon-bianjiqianbixieshuru" @tap="setAddress(item)"></view>
			</view>
			<view v-if="!addressList.length" class="p-3 text-center font-md" style="color: #666666;">
				暂无收获地址
			</view> 
			<view class="position-fixed left-0 bottom-0 right-0 text-fff main-bg-color text-center font-lg" @tap="addAddress"
				  style="height: 100rpx; line-height: 100rpx;">
				新增收获地址
			</view>
		</view>
	</view>
</template>

<script>
	import { getAddressList } from '../../service/pay.js'
	import navbar from '@/components/common/navbar.vue'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return{
				current: 0,
				addressList: []
			}
		},
		methods:{
			radioChange(e){
				console.log(e)
			},
			setAddress(item){
				console.log(item)
				uni.navigateTo({
					url: 'setAddress?id='+item.id
				})
			},
			goBack(){
				uni.navigateTo({
					url: 'pay'
				})
			},
			// 选中返回
			picthAddress(item){
				uni.navigateTo({
					url: './pay?id='+item.id
				})
			},
			addAddress(){
				uni.navigateTo({
					url: 'setAddress?id=0'
				})
			}
		},
		onShow(){
			uni.getStorage({
				key: 'token',
				success: res =>{
					getAddressList(res.data).then(res =>{
						this.addressList = res.data.data;
					})
				}
			})
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
</style>
