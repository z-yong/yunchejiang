<template>
	<view class="markey-list pt-2" style="background: #F7F7F7;min-height: 100%;">
		<view class="px-2 pb-4" style="background: #FFFFFF;">
			<view v-for="(item,index) in list" :key='index' class="main-border-bottom d-flex j-sb py-2 a-center" @tap="goToMarket(item)">
				<view class="d-flex j-sb a-center">
					<view class="" style="font-style: italic; font-weight: 600s; font-size: 50rpx;line-height: 80rpx; width: 80rpx;height: 80rpx;border-radius: 50%;background: #ecbf5e;color: #aa7400;">
						<text class="ml-2">{{index+1}}</text>
					</view>
					<view class="ml-3">
						<view class="font-md">{{item.name}}
						  {{item.type == 1 ? '--支付活动' : '--免费活动'}}
						</view>
						<!-- <view class="font" style="color: #888888;">{{item.time}}</view> -->
					</view>
				</view>
				<view class="iconfont icon-xiangyou font-md"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getActiveList } from '../../service/my.js'
	import { setStorge, getStorge } from '../../common/packaging_storge/storge.js'
	export default{
		data(){
			return{
				list: []
			}
		},
		methods:{
			goToMarket(item){
				uni.navigateTo({
					url:'market?id='+item.id
				})
			}
		},
		onLoad(){
			const store_id = getStorge('user_id')
			if(store_id){
				getActiveList(store_id).then(res =>{
					//判断返回是否有数据
					if(res.data.status == 200){
						this.list = res.data.data
					}
				})
			}
		}
	}
</script>

<style>
	.markey-list view{
		line-height: 1.2;
	}
</style>
