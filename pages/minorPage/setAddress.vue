<template>
	<view class="">
		<!-- <z-navbar bgColor='#ffffff' titleColor='#333333' :title='navTitle'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo1 position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 42rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar> -->
		<view class="" style="background: #F7F7F7;">
			<view class="mt-2" style="background: #FFFFFF;">
				<view class="d-flex p-2 pl-3 a-center main-border-bottom">
					<view class="" style="width: 140rpx;">
						收货人
					</view>
					<input type="text" style="width: 500rpx;" v-model="name" placeholder="请填写收货人的姓名" />
				</view>
				<view class="d-flex p-2 pl-3 a-center main-border-bottom">
					<view class="" style="width: 140rpx;">
						手机号
					</view>
					<input type="number" style="width: 500rpx;" v-model="phone" placeholder="请填写收货人的手机号" />
				</view>
				<view class="d-flex p-2 pl-3 a-center main-border-bottom">
					<view class="" style="width: 140rpx;">
						收货地址
					</view>
					<input type="text" style="width: 500rpx;" v-model="address" placeholder="请填写收货人的地址" />
				</view>
				<view class="p-2 pl-3">
					<label>
						<checkbox value="" :checked="isDefault" @tap='setDefault' color="#3fc21c"/><text>是否设为默认地址</text>
					</label>
				</view>
			</view>
			<view class="main-bg-color m-2 font-md text-fff text-center" style="border-radius: 10rpx; padding: 15rpx 0;" @tap="save">
				保存收货信息
			</view>
			<view v-if="id!=0" class="m-2 font-md text-fff text-center" style="border-radius: 10rpx; padding: 15rpx 0; background: #dd5a47;" @tap="deleteMess">
				删除收货信息
			</view>
		</view>
	</view>
</template>

<script>
	import { addAddressList, getIdAddress, updataAddressList, deleteAddressList } from '../../service/pay.js'
	import navbar from '@/components/common/navbar.vue'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return{
				navTitle: '',
				id: '',//用于区分是添加还是编辑
				isDefault: false,
				is_default: 1,
				name: '',
				phone: '',
				address: ''
			}
		},
		methods:{
			setDefault(){
				this.isDefault = !this.isDefault;
				if(this.isDefault){
					this.is_default = 2
				}else{
					this.is_default = 1
				}
			},
			goBack(){
				uni.navigateTo({
					url: 'address'
				})
			},
			save(){
				if(!this.name) return this._showToast('请填写收获人姓名');
				if(!this.phone) return this._showToast('请填写收获人手机号');
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){
				    return this._showToast('手机号输入有误!')
				}
				if(!this.address) return this._showToast('请填写收获地址');
				if(this.id == 0){
					uni.getStorage({
						key: 'token',
						success: res =>{
							addAddressList(res.data,this.phone,this.address,this.name,this.is_default).then(res =>{
								this._showToast(res.data.msg);
								if(res.data.status == 200){
									setTimeout(() =>{
										uni.navigateTo({
											url: 'address'
										})
									},500)
								}
							})
						}
					})
				}else {
					uni.getStorage({
						key: 'token',
						success: res =>{
							updataAddressList(res.data,this.phone,this.address,this.name,this.is_default,this.id).then(res =>{
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								if(res.data.status == 200){
									setTimeout(() =>{
										uni.navigateTo({
											url: 'address'
										})
									},500)
								}
							})
						}
					})
				}
			},
			deleteMess(){
				uni.getStorage({
					key: 'token',
					success: res =>{
						deleteAddressList(res.data,this.id).then(res =>{
							uni.showToast({
								title:res.data.msg,
								icon: 'none'
							})
							if(res.data.status == 200){
								setTimeout(() =>{
									uni.navigateTo({
										url: 'address'
									})
								},500)
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
		onLoad(option){
			this.id = option.id;
			console.log(option)
			if(option.id == 0){
				this.navTitle = '添加收货地址'
			}else{
				this.navTitle = '编辑收货地址'
				uni.getStorage({
					key: 'token',
					success: res =>{
						getIdAddress(res.data,option.id).then(res =>{
							this.name = res.data.data.name;
							this.phone = res.data.data.tel;
							this.is_default = res.data.data.status;
							this.address = res.data.data.address;
							if(this.is_default == 1){
								this.isDefault = false
							}else{
								this.isDefault = true
							}
						})
					}
				})
			}
				
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
