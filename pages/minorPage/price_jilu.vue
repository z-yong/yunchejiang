<template>
	<view class="main-border-top">
		<z-navbar bgColor='#ffffff' titleColor='#333333' title='申请提现'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo2 position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 46rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view v-for="(item,index) in list" :key='index' class="px-2 main-border-bottom">
			<view class="py-1 d-flex j-sb main-border-bottom" style="color: #888888;">
				<view class="">{{item.add_time}}</view>
				<view class="" v-if="item.status == 1">处理完成</view>
				<view class="" v-if="item.status == 2">待处理</view>
			</view>
			<view class="d-flex j-sb a-center">
				<view class="">
					<view class="">{{item.nickname}}</view>
					<view class="">{{item.account}}</view>
				</view>
				<view class="font-lg" v-if="item.status == 1" > +{{item.money}}</view>
				<view class="font-lg" v-if="item.status == 2" > {{item.money}}</view>
			</view> 
		</view>
	</view>
</template>

<script>
	import { getPriceList } from '../../service/my.js'
	import { getStorge } from '../../common/packaging_storge/storge.js'
	export default{
		data(){
			return {
				list: []
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			submit(){}
		},
		onLoad(){
			const token = getStorge('token')
			if(token){
				getPriceList(token).then(res =>{
					this.list = res.data.data
					console.log(this.list)
				})
			}
			
		}
	}
</script>

<style>
</style>
