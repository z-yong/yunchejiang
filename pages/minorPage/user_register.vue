<template>
		<view class="">
			<view class="form">
				<view class="uni-form-item uni-column font-md p-3">
					<view class="d-flex main-border-bottom a-center p-1">
					<!-- <text class="iconfont icon-shouji"></text> -->
						<view class="ml-2 d-flex j-sb a-center">
							<input class="pt-1 pb-1" type="number" v-model="tel" placeholder="请输入手机号"/>
							<view @tap="send" class="font text-fff send" style="background: #4566f3;margin-left: 100rpx;">
								{{isSend ? '重新获取 '+ second + 's' : codeText}}
							</view>
						</view>
					</view>
					<view class="d-flex main-border-bottom a-center p-1">
						<!-- <text class="iconfont icon-mima1"></text> -->
						<input class="ml-2 pt-1 pb-1" type="number" v-model="code" placeholder="请输入验证码"/>
					</view>
					<view class="d-flex main-border-bottom a-center p-1">
						<!-- <text class="iconfont icon-mima1"></text> -->
						<input class="ml-2 pt-1 pb-1" type="password" v-model="pass" placeholder="请设置密码"/>
					</view>
					<view class="d-flex main-border-bottom a-center p-1">
						<!-- <text class="iconfont icon-mima1"></text> -->
						<input class="ml-2 pt-1 pb-1" type="text" v-model="name" placeholder="请输入昵称"/>
					</view>
				</view>
				<view class="uni-btn-v mt-3">
					<button @tap="formSubmit">注 册</button> 
				</view>
			</view>
		</view>
</template>

<script>
	import { getCode, getUrl, getOpenid, userRegister } from '@/service/user.js'
	export default{
		data(){
			return{
				isSend: false,
				second: 60,
				codeText: '获取验证码',
				tel: '',
				pass: '',
				name: '',
				isInter: false,
				timer: '',
				code: ''
			}
		},
		methods:{
			showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
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
							this.code = '';
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
				const code = this.code;
				const pass = this.pass;
				const name = this.name;
				if(!tel) return this.showToast('请输入手机号');
				if(!(/^1[3456789]\d{9}$/.test(tel))){ 
				    return this.showToast('手机号输入有误！')
				} 
				if(!code) return this.showToast('请输入验证码');
				if(!pass) return this.showToast('请输入密码');
				if(!name) return this.showToast('请输入昵称');
				uni.getStorage({
					key: 'openid',
					success: res =>{
						if(res.data){
							const openid = res.data;
							uni.getStorage({
								key: 'code2',
								success: res =>{
									userRegister(this.tel,this.pass,this.name,openid,this.code,res.data).then(res =>{
										if(res.data.status == 200){
											this._showToast(res.data.msg)
											setTimeout(() =>{
												uni.navigateTo({
													url: 'login?tel='+this.tel
												})
											},600)
										}else {
											this._showToast(res.data.msg)
										}
									})
								},
								fail: err =>{
									userRegister(this.tel,this.pass,this.name,openid,this.code).then(res =>{
										if(res.data.status == 200){
											this._showToast(res.data.msg)
											setTimeout(() =>{
												uni.navigateTo({
													url: 'login?tel='+this.tel
												})
											},600)
										}else {
											this._showToast(res.data.msg)
										}
									})
								}
							})
						}else{
							this._getOpenid();
							this.tel = '';
							this.pass = '';
							this.code = '';
							this.name = '';
						}
					}
				})
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			// 获取code
			_GetQueryString(name){
				var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r!=null)return unescape(r[2]); return null;
			},
			// 重定向拿到code
			_getOpenid(){
				uni.getStorage({
					key: 'code',
					success: res =>{
						const code = res.data;
						if(!res.data){//'http://mycj.90plus.cn/#/pages/minorPage/login' res.data.data.redirect_uri;
							getUrl().then(res =>{//encodeURIComponent('http://mycj.90plus.cn/#/pages/minorPage/login')
								if(res.data.status == 200){
									const appId = res.data.data.appId;
									const redirect_uri = res.data.data.redirect_uri;
									// location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
									location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect;"
									getOpenid(code).then(res =>{
										console.log('通过code从后台获取的openid:'+res.data.data)
										uni.setStorage({
											key: 'openid',
											data: res.data.data.openid
										})	
									})
								}else{
									this._getOpenid()
								}
							})
						}else{
							getOpenid(res.data).then(res =>{
								console.log('通过code从后台获取的openid:'+res.data.data)
								uni.setStorage({
									key: 'openid',
									data: res.data.data.openid
								})	
							})
						}
					},
					fail: err =>{
						getUrl().then(res =>{//encodeURIComponent('http://mycj.90plus.cn/#/pages/minorPage/login')
							if(res.data.status == 200){
								const appId = res.data.data.appId;
								const redirect_uri = res.data.data.redirect_uri;
								location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
							}
						})
					}
				})
			}
		},
		onLoad(){
			// 获取code
			const code = this._GetQueryString('code');
			// const url = window.location.href;
			uni.setStorage({
				key: 'code',
				data: code
			})
			this._getOpenid()
		}
	}
</script>

<style>
	.form{
		margin-top: 220upx;
		box-sizing: border-box;
	}
	.form input{
		/* display: inline-block; */
		max-width: 500upx;
	}
	.send{
		padding: 5upx 15upx;
		border-radius: 20upx;
	}
</style>
