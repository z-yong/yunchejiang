<template>
	<view class='login-wrapper'>
		<z-navbar title='登录'>
			<template slot='cen'>
				<text class="ml-4" @tap="userRegister">注册</text>
			</template>
		</z-navbar>
		<view class="form">
			<form>
				<view class="d-flex p-2 pl-4">
					<view v-for="(item,index) in menus" :key='index' @tap="clickMenu(index)"
						  class="mr-2 px-2 font-lg" :class="currentIndex == index ? 'active-menu' : ''">
						{{item}}
					</view>
				</view>
			    <view class="uni-form-item uni-column font-md p-3">
			        <view class="d-flex main-border-bottom a-center p-1">
						<text class="iconfont icon-shouji"></text>
						<view class="ml-2 d-flex j-sb a-center">
							<input class="pt-1 pb-1" type="number" v-model="tel" placeholder="请输入手机号"/>
							<view v-if="currentIndex == 1" @tap="send" class="font text-fff send" style="background: #4566f3;margin-left: 100rpx;">
								{{isSend ? '重新获取 '+ second + 's' : codeText}}
							</view>
						</view>
					</view>
					<view class="d-flex main-border-bottom a-center p-1">
						<text class="iconfont icon-mima1"></text>
						<input v-if="currentIndex == 1" class="ml-2 pt-1 pb-1" type='number' v-model="pass" placeholder='请输入验证码'/>
						<input v-if="currentIndex == 0" class="ml-2 pt-1 pb-1" type='password' v-model="pass" placeholder='请输入密码'/>
					</view>
					<view class="forget d-flex j-sb pr-4 mt-2">
						<text style="color: #888;" @tap="forgetPass">
							<text class="mr-1">忘记密码?</text>
						</text>
						<!-- <text style="color: #888;">
							<text class="mr-1">没有账号?</text>
							<text style="color: #007AFF;" class="mr" @tap="userRegister">去注册..</text>
						</text> -->
					</view>
			    </view>
			    <view class="uni-btn-v">
			        <button @tap="formSubmit">登 录</button> 
			    </view>
			</form>
		</view>
	</view>
</template>

<script>
	import navbar from '@/components/common/navbar.vue'
	import { postPassLogin, postCodeLogin, getCode, getUrl, getOpenid, postStoreId } from '@/service/user.js'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return{
				password: '',
				isSend: false,
				second: 60,
				codeText: '获取验证码',
				tel: '',
				pass: '',
				isInter: false,
				timer: '',
				code: '',
				menus: ['密码登录'], //'验证码登录',
				currentIndex: 0
			}
		},
		methods:{
			showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			forgetPass(){
				uni.navigateTo({
					url: 'forget_pass'
				})
			},
			clickMenu(index){
				this.currentIndex = index;
			},
			send(){
				if(!this.tel) return this._showToast('请输入手机号');
				if(!(/^1[3456789]\d{9}$/.test(this.tel))){
				    return this._showToast('手机号输入有误!')
				}
				if(!this.isSend){
					getCode(this.tel).then(res =>{
						if(res.data.status == 200){
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							this.code = res.data.data.code;
							const _this = this;
							this.isSend = true;
							this.isInter = true;
							this.timer = setInterval(function(){
								_this.second = _this.second - 1;
								if(_this.second == -1){
									clearInterval(_this.timer);
									_this.codeText = '重新获取';
									_this.isSend = false;
									_this.second = 60;
									_this.isInter = false;
								}
							},1000)
						}else{
							this._showToast(res.data.msg)
							this.tel = '';
							this.pass = ''
						}
					})
				}
			},
			formSubmit(){
				const tel = this.tel;
				const pass = this.pass;
				if(!tel) return this.showToast('请输入手机号');
				if(!(/^1[3456789]\d{9}$/.test(tel))){ 
				    return this.showToast('手机号输入有误！')
				} 
				if(!pass&&this.currentIndex == 1) return this.showToast('请输入验证码');
				if(!pass&&this.currentIndex == 0) return this.showToast('请输入密码');
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						if(res.data == null){
							this._showToast('进入商家有误')
						}else{
							const url = window.location.search.slice(1)
							if(this.currentIndex == 1){
								postCodeLogin(this.tel,this.pass,url).then(res =>{
									if(res.data.status == 200){
										uni.setStorage({
											key: 'token',
											data:  res.data.data.token
										})
										uni.setStorage({
											key: 'tel',
											data: tel
										})
										this._showToast('登录成功');
										setTimeout(() =>{
											uni.switchTab({
												url: '../index/index'
											})
										},600)
									}else {
										this._showToast(res.data.msg);
									}
								})
							}else if(this.currentIndex == 0){
								postPassLogin(this.tel,this.pass, url).then(res =>{
									if(res.data.status == 200){
										this._showToast('登录成功');
										uni.setStorage({
											key: 'token',
											data:  res.data.data.token
										})
										uni.setStorage({
											key: 'tel',
											data: tel
										})
										setTimeout(() =>{
											uni.getStorage({
												key: 'code2',
												success: res =>{
													if(!res.data){
														uni.switchTab({
															url: '../index/index'
														})
													}else{
														uni.getStorage({
															key: 'active_id',
															success: res =>{
																uni.navigateTo({
																	url: 'market?id='+res.data
																})
															}
														})
													}
												},
												fail: err =>{
													uni.switchTab({
														url: '../index/index'
													})
												}
											})
										},600)
									}else {
										this._showToast(res.data.msg);
									}
								})
							}
						}
					},
					fail: err =>{
						this._showToast('进入商家有误')
					}
				})
			},
			userRegister(){
				uni.navigateTo({
					url: 'user_register'
				})
			},
			merchantRegister(){
				uni.navigateTo({
					url: 'merchant_register'
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
			// uni.setStorage({
			// 	key: 'user_id',
			// 	data: 1
			// })
			uni.getStorage({
				key: 'tel',
				success: res =>{
					uni.navigateTo({
						url: '../index/index'
					})
				}
			})
			if(option.tel){
				this.tel = option.tel
			}
		}
	}
</script>

<style>
	.login-wrapper{
		/* position: absolute; */
	}
	.form{
		margin-top: 300upx;
		box-sizing: border-box;
	}
	.active-menu{
		background: #4566f3;
		color: #FFFFFF;
		border-radius: 10rpx;
	}
	.form input{
		/* display: inline-block; */
		max-width: 500upx;
		border-style: none;
		outline: none;
		border-color: transparent;
	}
	.send{
		padding: 5upx 15upx;
		border-radius: 20upx;
	}
</style>
