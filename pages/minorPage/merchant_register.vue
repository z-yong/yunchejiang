<template>
	<view class="p-3 mer">
		<view v-for="(item,index) in messList" :key='index' class="d-flex p-2 main-border-bottom font-md" :class="item.aptitude || item.address ? '' : 'a-center'">
			<view class="" style="width: 160upx;">{{item.name || item.address || item.aptitude}}</view>
			<input v-if="item.name" type="text" v-model="item.desc" :placeholder="item.placeholder" />
			<view v-if="item.address" class="ml-1 font-md d-flex j-sb" style="width: 80%;height: 50rpx;" @tap="goToMap"
				  :style="{color: address == '点击选择您的位置' ? '#888888' : '#333333'}">
				{{address}}
				<text v-if="address == '点击选择您的位置'" class="iconfont icon-xiangyou"></text>
			</view>
			<view class="d-flex j-sb a-center">
				<input v-if="item.tel" type="number" v-model="item.desc" :placeholder="item.placeholder"/>
				<view v-if="item.tel" @tap="send" class="font-sm text-fff" style="background: #b5eba7;" 
					  :class="isSend ? 'is-send' : 'no-send'">
					{{isSend ? second : codeText}}
				</view>
			</view>
			<input v-if="item.pass" type="password" v-model="item.desc" :placeholder="item.placeholder" />
			<input v-if="item.code" type="text" v-model="item.desc" :placeholder="item.placeholder" />
			<view v-if="item.aptitude" class="" style="width: 465upx;">
				<view v-if="!item.desc" type="file" @tap="selectPhoto" class="w-100" style="background: #e6e6e6; height: 290upx;"></view>
				<image v-if="item.desc" @tap="selectPhoto" class="w-100" :src="item.desc" mode="widthFix"></image>
				<view class="font" style="color: #999999;">照片要求：图片清晰</view>
			</view>
		</view>
		<view class="main-bg-color text-fff text-center p-2" style="width: 600upx; margin: 30upx auto 0; border-radius: 5upx;" @tap="submit">提交</view>
	</view>
</template>

<script>
	import{ createStore } from '../../service/my.js'
	import { getStorge } from '../../common/packaging_storge/storge.js'
	export default{
		data(){
			return{
				isSend: false,
				second: 60,
				isInter: false,
				timer: '',
				imgUrl: '',
				code: 0,
				codeText: '获取验证码',
				address: '点击选择您的位置',
				messList: [
					{name: '门店名称', desc: '',placeholder: '请输入店铺名称'},
					{address: '门店地址', desc: ''},
					{name: '详细地址', desc: '',placeholder: '请输入店铺详细地址'},
					{aptitude: '营业资质', desc: ''}
				]
			}
		},
		methods:{
			goToMap(){
				uni.chooseLocation({
				    success: (res) =>{
				        this.address = res.address
				    }
				});
			},
			send(){
				if(!this.messList[4].desc) return this._showToast('请输入手机号');
				if(!(/^1[3456789]\d{9}$/.test(this.messList[4].desc))){
				    return this._showToast('手机号输入有误！')
				}
				if(!this.isSend){
					getCode(this.messList[4].desc).then(res =>{
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
					})
				}
			},
			selectPhoto(){
				uni.chooseImage({
					count: 1,
					success: res =>{
						
						this.messList.forEach(ele =>{
							if(ele.aptitude){
								ele.desc = res.tempFilePaths[0]
							}
						})
						uni.uploadFile({
							url: 'http://yun.90plus.cn/api.php/common/upload-image',
							name: 'filename',
							// header:{'content-type': 'multipart/form-data'},
							filePath: res.tempFilePaths[0],
							// fileType: 'image',
							success: res =>{
								const data = JSON.parse(res.data)
								this.imgUrl = data.dir
							}
						})
					}
				})
			},
			submit(){
				const data = {};
				this.messList.forEach((ele,index) =>{
					if(index == 0) {
						if(!ele.desc){
							return this._showToast('请输入店铺名称');
						}
						data.name = ele.desc;
					}
					if(index == 2) {
						if(!ele.desc) {
							return this._showToast('请输入店铺详细地址');
						}
						data.address = ele.desc;
					}
					if(index == 3){
						if(!this.imgUrl) {
							if(!ele.desc) {
								return this._showToast('请上传店铺执照');
							}
						}
						data.facade = this.imgUrl
					}
				})
				if(data.name && data.address && data.facade){
					const token = getStorge('token')
					if(token){
						if(this.address != '点击选择您的位置'){
							data.address = this.address + data.address;
						}
						createStore(token,data.name,data.facade,data.address).then(res =>{
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
					}
				}
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
		},
		onLoad() {
			const _this = this;
			// 获取用户地址
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
					const point = new plus.maps.Point(res.longitude, res.latitude);
					plus.maps.Map.reverseGeocode(
								point,
								{},
								function(event) {
								const address = event.address; // 转换后的地理位置
								const point = event.coord; // 转换后的坐标信息
								const coordType = event.coordType; // 转换后的坐标系类型
								uni.setStorage({
									key: 'address',
									data: address
								})
								_this.messList.forEach(ele =>{
									if(ele.address){
										ele.desc = address
									}
								})
						},
						function(e) {}
					)
				}
			});
			// 验证用户是否已提交审核
			uni.getStorage({
				key: 'UID',
				success: res =>{
					const uid = res.data;
					// getInfo(uid).then(res =>{
					// 	if(res.data.code == 400){
					// 		uni.showModal({
					// 			title: '提示',
					// 			content: res.data.msg,
					// 			showCancel: false,
					// 			success: res =>{
					// 				  if (res.confirm) {
					// 						uni.navigateBack({
					// 							delta:1
					// 						})
					// 				   }
					// 			}
					// 		})
					// 	}
					// })
				}
			})
		},
	}
</script>

<style>
	.is-send{
		border-radius: 50%;
		width: 40upx;
		height: 40upx;
		line-height: 40upx;
		text-align: center;
	}
	.no-send{
		padding: 2upx 15upx;
		border-radius: 15upx;
	}
	.mer view{
		line-height: 1.1;
	}
</style>
