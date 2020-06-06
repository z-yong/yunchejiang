<template>
	<view class="h-100" style="background: #F7F7F7;">
		<z-navbar bgColor='#ffffff' titleColor='#333333' title='账号设置'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 46rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view class="h-100" style="margin-top: 150rpx;">
			<view class="px-2" style="background: #FFFFFF;">
				<view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">联系人姓名</view>
					<input type="text" v-model="name"/>
				</view>
				<!-- <view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">手机号</view>
					<input type="number" disabled :value="tel"/>
				</view>
				<view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">验证码</view>
					<input type="number" v-model="code" placeholder="请输入验证码"/>
					<view @tap="send" class="font-sm text-fff send" style="background: #3fc21c;">
						{{isSend ? '重新获取 '+ second + 's' : codeText}}
					</view>
				</view> -->
				<view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">旧密码</view>
					<input type="password" v-model="pass" placeholder="无需重设可不填写"/>
				</view>
				<view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">重设密码</view>
					<input type="password" v-model="pass1" placeholder="无需重设可不填写"/>
				</view>
				<view class="d-flex py-2 main-border-bottom">
					<view class="font-md" style="width: 200rpx;">确认密码</view>
					<input type="password" v-model="pass2" placeholder="无需重设可不填写"/>
				</view>
			</view>
			<view class="main-bg-color text-fff text-center p-2" style="width: 670upx; margin: 180rpx auto 0; border-radius: 5upx;" 
				@tap="submit">确认提交</view>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	import { getStorge } from '../../common/packaging_storge/storge.js'
	import { getAccountMess, amendAccountMess } from '../../service/user.js'
	export default{
		components:{
			'z-navbar': navbar
		},
		data(){
			return{
				uid: '',
				name: '',
				tel: '',
				code: '',
				trueCode: '',//验证验证码是否正确
				pass: '',
				pass1: '',
				pass2: '',
				isSend: false,
				second: 60,
				isInter: false,
				timer: '',
				codeText: '获取验证码',
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// send(){
			// 	if(!this.tel) return this._showToast('请输入手机号');
			// 	if(!(/^1[3456789]\d{9}$/.test(this.tel))){
			// 	    return this._showToast('手机号输入有误！')
			// 	}
			// 	if(!this.isSend){
			// 		getCode(this.uid,this.tel).then(res =>{
			// 			this.trueCode = res.data.data.code;
			// 			const _this = this;
			// 			this.isSend = true;
			// 			this.isInter = true;
			// 			this.timer = setInterval(function(){
			// 				_this.second = _this.second - 1;
			// 				if(_this.second == -1){
			// 					clearInterval(_this.timer);
			// 					_this.codeText = '重新获取';
			// 					_this.isSend = false;
			// 					_this.second = 60;
			// 					_this.isInter = false;
			// 				}
			// 			},1000)
			// 		})
			// 	}
			// },
			submit(){
				if(!this.name) return this._showToast('请输入联系人姓名');
				if(this.code != this.trueCode) return this._showToast('验证码输入有误！');
				if(this.pass1 != this.pass2) return this._showToast('两次密码输入不一致！');
				amendAccountMess(this.token,this.name,this.pass,this.pass1).then(res =>{
					if(res.data.code == 200){
						this._showToast(res.data.msg)
						setTimeout(() =>{
							uni.navigateBack({
								delta:1
							})
						},600)
					}else{
						this._showToast(res.data.msg)
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
		onLoad(){
			this.token = getStorge('token');
			if(this.token){
				getAccountMess(this.token).then(res =>{
					if(res.data.status == 200){
						this.name = res.data.data;
					}
				})
			}
		}
	}
</script>

<style>
	.send{
		padding: 5upx 15upx;
		border-radius: 20upx;
		white-space: nowrap;
	}
</style>
