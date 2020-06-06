<template>
	<view class="p-2 main-border-top">
		<view class="py-2 main-border-bottom">
			<input class="w-100" type="text" v-model="tel" placeholder="请输入注册时手机" />
		</view>
		<view class="py-2 d-flex j-sb a-center main-border-bottom" style="box-sizing: border-box;">
			<input style="width: 65%;" type="text" v-model="code" placeholder="请输入验证码" />
			<view class="">
				|<text class="ml-2" @tap="send">{{isSend ? '重新获取'+second+'s' : text}}</text>
			</view>
		</view>
		<view class="py-2 main-border-bottom">
			<input class="w-100" type="password" v-model="pass" placeholder="设置新密码" />
		</view>
		<view class="py-2 main-border-bottom">
			<input class="w-100" type="password" v-model="pass2" placeholder="确认密码" />
		</view>
		<view class="mt-4 text-center text-fff p-2 main-bg-color" style="border-radius: 15rpx;" @tap="submit">
			确定
		</view>
	</view>
</template>

<script>
	import{ forgetPwd } from '../../service/my.js'
	import { getCode } from '@/service/user.js'
	export default{
		data(){
			return{
				text: '获取验证码',
				tel: '',
				isSend: false,
				code: '',
				pass: '',
				pass2: '',
				second: 60
			}
		},
		methods:{
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
							this.timer = setInterval(function(){
								_this.second = _this.second - 1;
								if(_this.second == -1){
									clearInterval(_this.timer);
									_this.text = '重新获取';
									_this.isSend = false;
									_this.second = 60;
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
			submit(){
				if(!(/^1[3456789]\d{9}$/.test(this.tel))){
				    return this._showToast('手机号输入有误!')
				}
				if(!this.pass){
					return this._showToast('新密码不能为空!')
				}
				if(!this.code){
					return this._showToast('验证码不能为空!')
				}
				if(!this.tel){
					return this._showToast('手机号码不能为空!')
				}
				if(this.pass != this.pass2){
					 return this._showToast('两次密码不一致!')
				}
				forgetPwd(this.tel,this.code,this.pass).then(res =>{
					if(res.data.status == 200){
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
		}
	}
</script>

<style>
</style>
