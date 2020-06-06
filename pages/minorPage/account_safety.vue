<template>
	<view class="">
		<z-navbar bgColor='#ffffff' titleColor='#333333' title='账号设置'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 46rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view class="main-border-top" style="margin-top: 130rpx;">
			<view class="d-flex j-sb px-2 py-3 a-center main-border-bottom" @tap="setAccount">
				<view class="font-md">账号与安全</view>
				<view class="d-flex a-center font" style="color: #888888;">
					<text class="mr">前往设置</text>
					<text class="iconfont icon-xiangyou"></text>
				</view>
			</view>
		</view>
		<view class="main-bg-color text-fff text-center p-2 w-100 position-fixed left-0 right-0 bottom-0" style="border-radius: 5upx;" @tap="exit">退出登录</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	export default{
		components:{
			'z-navbar': navbar
		},
		methods:{
			goBack(){
				uni.reLaunch({
					url: '../my/my'
				})
			},
			setAccount(){
				uni.navigateTo({
					url: 'set_account'
				})
			},
			exit(){
				uni.showModal({
					title: '提示',
					content: '确认退出？',
					success: res =>{
						if(res.confirm){
							uni.getStorage({
								key: 'user_id',
								success: res =>{
									const user_id = res.data;
									uni.clearStorage();
									uni.setStorage({
										key: 'user_id',
										data: user_id
									})
									uni.showToast({
										title: '退出成功'
									})
									setTimeout(() =>{
										uni.reLaunch({
											url: '../index/index'
										})
									},600)
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style>
</style>
