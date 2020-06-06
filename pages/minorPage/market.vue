<template>
	<view class="mark-wrapper">
		<view class="mark-bg span-20 position-relative">
			<image style="width: 750rpx;" class="span-20" :src="bg" mode="widthFix"></image>
			<z-back-icon @goIndex='goPage' market/>
		</view>
		<view class="company">
			<view class="company-mess pl-2">
				<view class="mess-item main-border-bottom font-md">
					<text class="name">公司名称</text>
					<text class="ml-3">{{store_name}}</text>
				</view>
				<view class="mess-item main-border-bottom font-md">
					<text class="name">公司电话</text>
					<text class="ml-3" style="color: #f5ad00;">{{store_tel}}</text>
				</view>
				<view class="mess-item main-border-bottom font-md">
					<text class="name">公司地址</text>
					<text class="ml-3">{{store_address}}</text>
					<!-- <text style="color: #f5ad00;" class="ml-1">[查看地图]</text> -->
				</view>
				<view class="mess-item main-border-bottom font-md">
					<text class="name">活动名称</text>
					<text class="ml-3">{{activity_name}}</text>
					<!-- <text style="color: #f5ad00;" class="ml-1">[查看地图]</text> -->
				</view>
				<view v-if="isFree == 1" class="mess-item main-border-bottom font-md">
					<text class="name">活动优惠价</text>
					<text class="ml-3">￥{{activity_price}}</text>
					<!-- <text style="color: #f5ad00;" class="ml-1">[查看地图]</text> -->
				</view>
				<z-cut/>
				<view class="mess-item main-border-bottom font-md d-flex a-center">
					<text class="name">手机号码</text>
					<input class="ml-3" style="width: 480rpx;" type="number" v-model="user_phone" placeholder="请输入手机号"/>
				</view>
				<view class="mess-item main-border-bottom font-md d-flex a-center">
					<text class="name">车牌号码</text>
					<input @focus="toCar_card" class="ml-3" style="width: 480rpx;" type="text" v-model="user_car" placeholder="请输入车牌号 (示例:京A00001)"/>
				</view>
			</view>
			<view class="market-btn" @tap="submit">{{isFree == 1 ? '立即抢购' : '免费领取'}}</view>
		</view>
		<view v-if="tableList.length != 0" class="table mt-2 p-1">
			<view class="table-title font-md text-center">
				已登记领取
				<text style="color: #ff0000;">{{num}}</text>
				份
			</view>
			<view class="table-box">
				<view class="table-title d-flex a-center" style="background: #e2e6e9;">
					<view class="h-90 text-center main-border" style="width: 115upx;">序号</view>
					<view class="h-90 main-border" style="width: 225upx;">车牌</view>
					<!-- <view class="h-90 main-border" style="width: 90upx;">头像</view> -->
					<view class="h-90 main-border" style="width: 150upx;">状态</view>
					<view class="h-90 main-border" style="width: 240upx;">登记时间</view>
				</view>
				<view class="table-item d-flex a-center" v-for="(item,index) in tableList" :key='index'>
					<view class="h-90 text-center main-border" style="width: 115upx;">{{item.serial}}</view>
					<view class="h-90 text-center main-border" style="width: 225upx;">{{item.car_num}}</view>
				 	<!-- <view class="h-90 main-border d-flex j-center a-center" style="width: 90upx;">
						<image class="wh-60" :src="item.head" mode=""></image>
					</view> -->
					<view class="h-90 text-center main-border" style="width: 150upx;">{{isFree == 1 ? '已支付' : '已领券'}}</view>
					<view class="h-90 text-center main-border" style="width: 240upx;">{{item.add_time}}</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-list d-flex j-sb m-auto" style="padding: 0 120upx; color: #b3bbc2;">
				<view class="foot-item" v-for="(item,index) in footMess" :key='index'>{{item}}</view>
			</view>
		</view>
		<z-share @shareMess='shareMess'/>
		<view class="kuang" ref='kuang'>
		</view>
	</view>
</template>

<script>
	import cut from "@/components/common/cut.vue"
	import share from "@/components/common/share.vue"
	import backIcon from "@/components/common/back_page.vue"
	import { getMarketData, payment, getPackage, getUrl, postStoreId, getState, getTableData } from '../../service/market.js'
	import { setStorge, getStorge } from '../../common/packaging_storge/storge.js'
	export default{
		components:{
			"z-cut": cut,
			"z-share": share,
			"z-back-icon": backIcon
		},
		data(){ 
			return {
				id: '',
				num: 0,
				url: 'http://mycj.90plus.cn/#/pages/minorPage/market',
				bg: '',
				isFree: 0,
				store_name: '',
				store_tel: '',
				store_address: '',
				activity_name: '',
				activity_price: 0.00,
				user_phone: '',
				user_car: '',
				tableList: [],
				footMess: ['©2019 云车匠科技', '|', '活动策划', '|', '系统提供']
			}
		},
		methods: {
			goPage(){
				const code = getStorge('code2');
				if(code){
					uni.reLaunch({
						url: '../index/index' 
					})
				}else{
					uni.navigateBack({
						delta:1
					})
				}
			},
			submit(){
				uni.getStorage({
					key: 'token',
					success: res =>{
						if(!this.user_phone) return this._showToast('请输入您的手机号');
						if(!(/^1[3456789]\d{9}$/.test(this.user_phone))) return this._showToast('您的手机号输入有误！');
						if(!this.user_car) return this._showToast('请填写您的车牌号');
						// if(!this._isVehicleNumber(this.user_car)) return this._showToast('您的车牌号输入有误！');
						if(res.data){
							const token = res.data;
							uni.getStorage({
								key: 'user_id',
								success: res =>{
									if(res.data){
										const store_id = res.data;
										const active_id = getStorge('active_id');
										if(active_id){
											payment(token,store_id,active_id,this.user_car,this.user_phone,this.isFree).then(res =>{
												if(res.data.status == 200){
													if(this.isFree == 1){
														const data = res.data.data;
														setStorge('phone',this.user_phone);
														setStorge('car',this.user_car)
														if(!WeixinJSBridge){
															if(document.addEventListener){
																document.addEventListener('WeixinJSBridgeReady', function(){
																		_this._onBridgeReady(data)
																}, false);
															} else if (document.attachEvent){
																document.attachEvent('WeixinJSBridgeReady', function(){ _this._onBridgeReady(data) });
																document.attachEvent('onWeixinJSBridgeReady', function(){ _this._onBridgeReady(data) });
															}
														}else{
															this._onBridgeReady(data)
														}
													}else{
														this._showToast(res.data.msg);
														setTimeout(() =>{
															uni.navigateTo({
																url: 'markey_list'
															})
														},600)
													}
												}else{
													this._showToast(res.data.msg)
												}
											})
										}
									}else{
										uni.getStorage({
											key: 'code2',
											success: res =>{
												const code2 = res.data;
												uni.getStorage({
													key: 'store_id',
													success: res =>{
														uni.navigateTo({
															url: 'login?store_id='+res.data+'&code='+code2
				 										})
													}
												})
											},
											fail: err =>{
												uni.navigateTo({
													url: 'login'
												})
											}
										})
									}
								}
							})
						}else{
							uni.getStorage({
								key: 'code2',
								success: res =>{
									const code2 = res.data;
									uni.getStorage({
										key: 'store_id',
										success: res =>{
											uni.navigateTo({
												url: 'login?store_id='+res.data+'&code='+code2
											})
										}
									})
								},
								fail: err =>{
									uni.navigateTo({
										url: 'login'
									})
								}
							})
						}
					},
					fail: err =>{
						uni.showModal({
							title: '提示',
							content: '您还没有登录',
							showCancel: false,
							success: res =>{
								uni.getStorage({
									key: 'code2',
									success: res =>{
										const code2 = res.data;
										uni.getStorage({
											key: 'store_id',
											success: res =>{
												uni.reLaunch({
													url: 'login?store_id='+res.data+'&code='+code2
												})
											}
										})
									},
									fail: err =>{
										uni.navigateTo({
											url: 'login'
										})
									}
								})
							}
						})
					}
				})
			},
			toCar_card(){
				const active_id = getStorge('active_id');
				if(active_id){
					uni.navigateTo({
						url: 'car_card?id='+active_id+'&tel='+this.user_phone
					})
				}else{
					this._showToast('没有active_id')
				}
			},
			shareMess(){
				this._showToast('请点击右上角分享按钮');
				this.$nextTick(() =>{
					const kuang = document.getElementsByClassName('kuang')[0]
					kuang.style.opacity = '0.8';
					setTimeout(() =>{
						kuang.style.opacity = '0';
					},4000)
				})
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
			// 车牌号校验
			_isVehicleNumber(vehicleNumber) {
			    const xreg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
			    const creg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
			    if(vehicleNumber.length == 7){
			        return creg.test(vehicleNumber);
			    } else if(vehicleNumber.length == 8){
			        return xreg.test(vehicleNumber);
			    } else{
			        return false;
			    }
			},
			//////////// 微信接口实例
			_onBridgeReady(data){
				// 调用微信接口
				  if(WeixinJSBridge){
					WeixinJSBridge.invoke(
					    'getBrandWCPayRequest', {
					          "appId": data.appId,     //公众号名称，由商户传入     
					          "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数     
					          "nonceStr": data.nonceStr, //随机串     
					          "package":data.package,    // 统一下单接口返回的prepay_id 参数值 
					          "signType":data.signType,         //微信签名方式：     
					          "paySign": data.paySign //微信签名 
					    },
					    function(res){
					        if(res.err_msg == "get_brand_wcpay_request:ok" ){
					              // 使用以上方式判断前端返回,微信团队郑重提示：
					              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
									// uni.navigateTo({
					             // 	url: 'order_result?order_id='+this.order_id
					             // })
								 uni.navigateTo({
								 	url: 'markey_list'
								 })
							}
					     }
					);
				}
			},
			_getHref(){
				const href = window.location.href;
				const index = href.indexOf('?') + 1;
				const argument = href.slice(index);
				if(argument.length){
					var reg = /([^?&=]+)=([^?&=]*)/g;
					var arr = argument.match(reg);
					let store_id; 
					let code2;
					arr.forEach((ele) =>{
						const i = ele.indexOf('=');
						const name = ele.slice(0,i)
						if(name == 'store_id'){
							store_id = ele.slice(i+1)
						}
						if(name == 'code'){
							code2 = ele.slice(i+1)
						}
						if(name == 'active_id'){
							this.id = ele.slice(i+1);
							console.log('id',this.id)
						}
					})
					if(reg.test(argument)){
						uni.setStorage({
							key: 'store_id',
							data: store_id
						});
						uni.setStorage({
							key: 'code2',
							data: code2
						})
						uni.setStorage({
							key: 'user_id',
							data: store_id
						})
						uni.setStorage({
							key: 'active_id',
							data: this.id
						})
					}
				}
			},
			_getData(){
				const active_id = getStorge('active_id');
				if(active_id){
					getMarketData(active_id).then(res =>{
						if(res.data.status == 200){
							this.bg = res.data.data.active_img;
							this.store_name = res.data.data.store_name;
							this.store_tel = res.data.data.tel;
							this.store_address = res.data.data.address;
							this.activity_name = res.data.data.name;
							this.isFree = res.data.data.type;
							const price = parseFloat(res.data.data.active_price);
							this.activity_price = price.toFixed(2);
							const store_id = getStorge('user_id');
							if(store_id != undefined || store_id == null){
								getTableData(store_id,active_id).then(res =>{
									if(res.data.status == 200){
										this.num = res.data.data.count;
										this.tableList = res.data.data.list;
										this.tableList.forEach((ele,index) =>{
											ele.serial = index+1
										})
									}
								})
							}
						}else{
							this._showToast('暂无活动');
							setTimeout(() =>{
								uni.navigateBack({
									delta:1
								})
							},600)
						}
					})
				}else{
					this._showToast('没有active_id')
				}
			},
			_getUrl(token){
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						if(res.data != undefined || res.data != null){
							getUrl(token,res.data,getStorge('active_id')).then(res =>{
								if(res.data.status == 200){
									const data = res.data.data;
									this.url = data.url;
									// 微信分享
									this.jweixin.ready(() => { //需在用户可能点击分享按钮前就先调用
										this.jweixin.updateTimelineShareData({ 
											title: data.title, // 分享标题
											link: this.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
											imgUrl: data.share_img, //分享图标
											success: () =>{
												// 设置成功
												console.log('设置成功')
											}
										})
										this.jweixin.updateAppMessageShareData({
											title: data.title, // 分享标题
											desc: data.content, // 分享描述
											link: this.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
											imgUrl: data.share_img, // 分享图标
											success: () =>{
											// 设置成功
												console.log('设置成功')
											}
										})
									});
								}else{
									this._showToast(res.data.msg)
								}
							})
						}else{
							
						}
					},
					fail: err =>{
						
					}
				})
			},
			_shareConfig(){
				const href = window.location.href;
				let str = href.substring(0,href.indexOf("#"));
				getPackage(str).then(res =>{
					this.jweixin.config({
					  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					  appId: res.data.appId, // 必填，公众号的唯一标识
					  timestamp: res.data.timestamp, // 必填，生成签名的时间戳
					  nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
					  signature: res.data.signature,// 必填，签名
					  jsApiList: ['updateTimelineShareData','updateAppMessageShareData'] // 必填，需要使用的JS接口列表
					});
				})
			},
			_shareWX(){
				// 通过后端接口拿到当前带参数的url
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						if(token){
							this._getUrl(token)
						}else{
							this._getUrl('')
						}
					},
					fail: err =>{
						this._getUrl('')
					}
				})
			}
		},
		onLoad(options){
			if(options.id){
				this.id = options.id;
				uni.setStorage({
					key: 'active_id',
					data: this.id
				})
			}
			// 缓存的号码和车牌号必须在从url获取的前面
			if(getStorge('phone')){
				this.user_phone = getStorge('phone');
				this.user_car = getStorge('car')
			}
			// 从url获取的号码和车牌号必须在从缓存获取的后面
			if(options.car_value){
				this.user_car = options.car_value;
				this.user_phone = options.tel;
				setTimeout(() =>{
					const query = uni.createSelectorQuery().in(this);
					query.select('.company').boundingClientRect(data => {
						uni.pageScrollTo({
						    scrollTop: data.top+10,
						    duration: 300
						});
					}).exec();
				},100)
			}
			uni.getStorage({
				key: 'user_id',
				success: res =>{
					if(res.data == undefined || res.data == null){
						this._getHref()
					}
				},
				fail: err =>{
					this._getHref()
				}
			})
			if(!this.id){
				this._getHref()
			}
			this._getData();
			this._shareWX();
			this._shareConfig();
		}
	}
</script>

<style>
	.kuang{
		position: fixed;
		top: 10rpx;
		right: 20rpx;
		background: url(../../static/kuang.jpg) no-repeat;
		background-position: center;
		background-size: cover;
		width: 150rpx;
		height: 130rpx;
		opacity: 0;
		transition: opacity 1s linear; 
	}
	.company-mess .mess-item{
		padding: 20upx 0;
	}
	.market-btn{
		width: 590upx;
		margin: 30upx auto;
		padding: 20upx 0; 
		color: #FFFFFF;
		font-size: 32upx;
		text-align: center;
		background: #65d51f;
		border-radius: 20upx;
	}
	.table-box{
		margin: 20upx auto;
		border: 1upx solid #F0F0F0;
		text-align: center;
	}	
	.footer{
		padding: 20upx 0;
	}
</style>
