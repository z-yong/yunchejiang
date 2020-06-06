<template>
	<view class="classMenu">
		<view class="class-item" v-for="(menu,index) in menuList" :key='index' @click="goNewPage(menu)">
			<image :src="menu.img" mode="widthFix"></image>
			<view class="menu-desc">{{menu.text}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props: {
			menuList: Array
		},
		methods: {
			goNewPage(menu){
				if(menu.text == '活动营销'){
					uni.getStorage({
						key: 'user_id',
						success: res =>{
							if(res.data != undefined || res.data != null){
								uni.navigateTo({
									url: '../../pages/minorPage/markey_list?store_id='+res.data
								});
							}
						}
					})	
				}else if(menu.text == '转盘抽奖'){
					uni.navigateTo({
						url: '../../pages/minorPage/draw?id=1'
					});
				}else if(menu.text == '认证商家'){
					uni.navigateTo({
						url: '../../pages/minorPage/merchant_register'
					})
				}
			}
		}
	}
</script>

<style>
	.classMenu{
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 40upx 15upx;
		text-align: center;
	}
	.classMenu .class-item image{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
	}
	.classMenu .class-item .menu-desc{
		font-size: 28upx;
		color: #b2b2b2;
	}
</style>
