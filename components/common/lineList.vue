<template>
	<view class="safety box-shadow">
		<view class="safety-title list-title p-2 main-border-bottom">
			{{title}}
		</view>
		<view class="safety-content pl-4">
			<view class="safety-item d-flex a-center j-sb main-border-bottom" v-for="(it,i) in safetyList" :key='i' @tap="goToPage(it)">
				<view class="list-title d-flex a-center">
					<image class="wh-60" :src="it.img" mode="widthFix"></image>
					<text class="p-2">{{it.title}}</text>
				</view>
				<view class="d-flex a-center">
					<text style="color: #BBBBBB;" class="font-md">{{it.desc}}</text>
					<text class="iconfont icon-xiangyou4" style="color: #BBBBBB;"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '标题'
			},
			safetyList: Array
		},
		methods: {
			goToPage(item){
				if(item.title == '优惠活动'){
					uni.navigateTo({
						url: '../../pages/minorPage/markey_list'
					})
				}else if(item.title == '中奖纪录'){
					uni.navigateTo({
						url: '../../pages/minorPage/activation_records?path=draw'
					})
				}else if(item.title == '活动纪录'){
					uni.navigateTo({
						url: '../../pages/minorPage/activation_records?path=activy'
					})
				}else if(item.title == '佣金纪录'){
					uni.navigateTo({
						url: '../../pages/minorPage/activation_records?path=commission'
					})
				}else if(item.title == '账号设置'){
					uni.navigateTo({
						url: '../../pages/minorPage/account_safety'
					})
				}else if(item.title == '申请提现'){
					uni.navigateTo({
						url: '../../pages/minorPage/deposit'
					})
				}
			}
		}
	}
</script>

<style>
	.safety{
		margin: 30upx auto 0;
	}
</style>
