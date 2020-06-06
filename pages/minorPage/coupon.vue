<template>
	<view class="">
		<view class="">
			<z-coupon :list='list' @getCoupon='getCoupon($event)'/>
			<view v-if="list.length == 0" class="" style="width: 60%;margin: 100rpx auto 0;">
				<image  src="/static/noCoupon.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>   
 
<script>
	import coupon from '@/components/common/coupon.vue'
	export default{
		components:{
			"z-coupon": coupon
		},
		data(){
			return{
				list: [],
				path: ''
			}
		}, 
		methods:{
			getCoupon(item){
				const store_id = this.getStorge('user_id')
				if(item.state == 0){
					this.$http.post('/api-user/shop-ling-coupon',{coupon_id: item.id,store_id},{token:true}).then(res =>{
						uni.showToast({
							title: '领取成功',
							icon: 'none'
						});
						this._getData(this.path)
					})
				}
			},
			_getData(path){
				const store_id = this.getStorge('user_id')
				if(path == 'goods_detail'){
					this.$http.post('/api-user/shop-get-coupon',{store_id},{token: true}).then(res =>{
						this.list = res;
					})
				}else if(path == 'my'){
					this.$http.post('/api-user/shop-my-coupon',{store_id},{token:true}).then(res =>{
						this.list = res;
					})
				}
			}
		},
		onLoad(option){
			this.path = option.path
			this._getData(option.path)
		}
	}
</script>

<style>
</style>
