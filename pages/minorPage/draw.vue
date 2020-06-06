<template>
	<view class="draw-wrapper">
		<z-navbar bgColor='#fd676d' title='抽奖大转盘'>
			<template slot="left">
				<view class="iconfont icon-xiangzuo position-absolute" @tap="goBack"
					  style="left: 15rpx; top: 75rpx; z-index: 9999;">
				</view>
			</template>
		</z-navbar>
		<view class="drax-box" style="background-image: '~@/static/commimg/prizebg.png'">
			<view class="drax-title">幸运大抽奖</view>
			<view class="draw-img text-center">
				<image class="draw" src="/static/commimg/dial.png" mode="widthFix" :animation="animationData"></image>
				<image class="pointer" src="/static/commimg/pointer.png" mode="widthFix" @click="startDraw"></image>
			</view>
		</view>
		<view class="rule">
			<view class="rule-content">
				<view class="">
					<view v-for="(item,index) in rules" :key='index' class="font-sm">{{item}}</view>
				</view>
				<view class="mt">
					<view class="font-sm">
						<text>一等奖：</text><text>{{draw1}}</text>
					</view>
					<view class="font-sm">
						<text>二等奖：</text><text>{{draw2}}</text>
					</view>
					<view class="font-sm">
						<text>三等奖：</text><text>{{draw3}}</text>
					</view>
					<view class="font-sm">
						<text>四等奖：</text><text>{{draw4}}</text>
					</view>
					<view class="font-sm">
						<text>五等奖：</text><text>{{draw5}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navbar from "@/components/common/navbar.vue"
	import { getDrawInfo, getDrawMess, getDrawPrize } from '../../service/draw.js'
	export default{
		components:{
			"z-navbar": navbar
		},
		data(){
			return {
				animationData: {},
				runDeg: 0,
				flag: true,
				rules: [],
				// 活动id
				id: '',
				// 中奖后向用户提示的文字
				desc: '',
				// 奖品
				draw1: '',
				draw2: '',
				draw3: '',
				draw4: '',
				draw5: '',
				// 中奖概率
				probability1: '',
				probability2: '',
				probability3: '',
				probability4: '',
				probability5: '',
				// 奖品总数
				probability1_num: '',
				probability2_num: '',
				probability3_num: '',
				probability4_num: '',
				probability5_num: '',
				// 已抽到的奖品数量
				probability1_ynum: '',
				probability2_ynum: '',
				probability3_ynum: '',
				probability4_ynum: '',
				probability5_ynum: '',
			}
		},
		methods:{
			goBack(){
				uni.navigateBack({
					delta: 1
				});
			},
			startDraw(){
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						const store_id = res.data;
						uni.getStorage({
							key: 'token',
							success: res =>{
								getDrawInfo(res.data,store_id).then(res =>{
									if(res.data.status != 200){
										uni.showModal({
											title: '提示',
											content: '您的抽奖次数已用完',
											showCancel: false
										})
										return
									}else{
										if(this.flag){
											this.flag = false;
											const num = Math.random()*10;
											// let realityDeg = 0;
											const duration = 5000
											// if(num > 0 && num <= 5){
											// 	realityDeg = Math.random()*72;
											// 	this._drawEnd(duration,'五等奖')
											// }else if(num > 5 && num <= 8){
											// 	realityDeg = 72 + Math.random()*72;
											// 	this._drawEnd(duration,'四等奖')
											// }else if(num > 8 && num <= 9.5){
											// 	realityDeg = 144 + Math.random()*72;
											// 	this._drawEnd(duration,'三等奖')
											// }else if(num > 9.5 && num <= 9.999){
											// 	realityDeg = 216 + Math.random()*72;
											// 	this._drawEnd(duration,'二等奖')
											// }else{
											// 	realityDeg = 288 + Math.random()*72;
											// 	this._drawEnd(duration,'一等奖')
											// }
											const realityDeg = this._getProbability()
											this.runDeg = 8*360 + realityDeg
											const animationRun = uni.createAnimation({  
											                      duration: duration,  
											                      timingFunction: 'ease'  
											                    })  
											animationRun.rotate(this.runDeg).step(); 
											this.animationData= animationRun.export();
											
										}
									}
								})
							}
						})
					}
				})
				
			},
			_getProbability(){
				const duration = 5000;
				let realityDeg = 0;
				let num = Math.random()*100;
				const num1 = this.probability1+this.probability2+this.probability3+this.probability4+this.probability5;
				const num2 = this.probability2+this.probability3+this.probability4+this.probability5;
				const num3 = this.probability3+this.probability4+this.probability5;
				const num4 = this.probability4+this.probability5;
				const num5 = this.probability5;
				if(num5 >= num){
					realityDeg = Math.random()*72;
					if(this.probability5_ynum >= this.probability5_num){
						this.desc = '对不起! 您来迟了,此奖品已发放完毕'
					}else{
						this._getDraw(this.draw5,5,'恭喜你! 抽到五等奖：'+this.draw5)
					}
					this._drawEnd(duration);
					return realityDeg
				}
				if(num4 >= num && num5 < num){
					realityDeg = 72 + Math.random()*72;
					if(this.probability4_ynum >= this.probability4_num){
						this.desc = '对不起! 您来迟了,此奖品已发放完毕'
					}else{
						this._getDraw(this.draw4,4,'恭喜你! 抽到四等奖：'+this.draw4)
					}
					this._drawEnd(duration);
					return realityDeg
				}
				if(num3 >= num && num4 < num){
					realityDeg = 144 + Math.random()*72;
					if(this.probability3_ynum >= this.probability3_num){
						this.desc = '对不起! 您来迟了,此奖品已发放完毕'
					}else{
						this._getDraw(this.draw3,3,'恭喜你! 抽到三等奖：'+this.draw3)
					}
					this._drawEnd(duration);
					return realityDeg
				}
				if(num2 >= num && num3 < num){
					realityDeg = 216 + Math.random()*72;
					if(this.probability2_ynum >= this.probability2_num){
						this.desc = '对不起! 您来迟了,此奖品已发放完毕'
					}else{
						this._getDraw(this.draw2,2,'恭喜你! 抽到二等奖：'+this.draw2)
					}
					this._drawEnd(duration);
					return realityDeg
				}
				if(num1 >= num && num2 < num){
					realityDeg = 288 + Math.random()*72;
					if(this.probability1_ynum >= this.probability1_num){
						this.desc = '对不起! 您来迟了,此奖品已发放完毕'
					}else{
						this._getDraw(this.draw1,1,'恭喜你! 抽到一等奖：'+this.draw1)
					}
					this._drawEnd(duration);
					return realityDeg
				}
				realityDeg = Math.random()*72;
				if(this.probability5_ynum >= this.probability5_num){
					this.desc = '对不起! 您来迟了,此奖品已发放完毕'
				}else{
					this._getDraw(this.draw5,5)
				}
				this._drawEnd(duration);
				return realityDeg
			},
			_getDraw(draw,num,desc){
				uni.getStorage({
					key: 'user_id',
					success: res =>{
						const store_id = res.data;
						uni.getStorage({
							key: 'token',
							success: res =>{
								getDrawPrize(draw,num,res.data,store_id,this.id).then(res =>{
									if(res.data.status == 200){
										this.desc = desc;
									}else{
										this.desc = res.data.msg
									}
								})
							},
							fail: err =>{
								uni.showModal({
									title: '提示',
									content: '请先登录',
									showCancel: false,
									success: res =>{
										uni.navigateTo({
											url: 'login'
										})
									}
								})
							}
						})
					},
					fail: err =>{
						uni.showModal({
							title: '提示',
							content: '请先登录',
							showCancel: false,
							success: res =>{
								uni.navigateTo({
									url: 'login'
								})
							}
						})
					}
				})
			},
			_drawEnd(duration){
				const _this = this;
				setTimeout(() =>{
					uni.showModal({
						duration: 100,
						title: '提示',
						content: this.desc,
						showCancel: false,
						success: function (res) {
							// 转盘归位
						        if (res.confirm) {
						            _this.flag = true;
						            const runBack = uni.createAnimation({
						                                  duration: 0,  
						                                  timingFunction: 'ease'  
						                                })  
						            runBack.rotate(0).step();
						            _this.animationData= runBack.export();
						        }
						    }
					})
				}, duration);
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			}
		},
		onLoad(){
			uni.getStorage({
				key: 'user_id',
				success: res =>{
					const store_id = res.data;
					getDrawMess(store_id).then(res =>{
						if(res.data.status == 200){
							this.probability1 = parseInt(res.data.data.price.prize.g_num1);
							this.probability2 = parseInt(res.data.data.price.prize.g_num2);
							this.probability3 = parseInt(res.data.data.price.prize.g_num3);
							this.probability4 = parseInt(res.data.data.price.prize.g_num4);
							this.probability5 = parseInt(res.data.data.price.prize.g_num5);
							this.probability1_num = parseInt(res.data.data.price.prize.num1);
							this.probability2_num = parseInt(res.data.data.price.prize.num2);
							this.probability3_num = parseInt(res.data.data.price.prize.num3);
							this.probability4_num = parseInt(res.data.data.price.prize.num4);
							this.probability5_num = parseInt(res.data.data.price.prize.num5);
							this.probability1_ynum = parseInt(res.data.data.price.prize.y_num1);
							this.probability2_ynum = parseInt(res.data.data.price.prize.y_num2);
							this.probability3_ynum = parseInt(res.data.data.price.prize.y_num3);
							this.probability4_ynum = parseInt(res.data.data.price.prize.y_num4);
							this.probability5_ynum = parseInt(res.data.data.price.prize.y_num5);
							this.draw1 = res.data.data.price.prize.name1;
							this.draw2 = res.data.data.price.prize.name2;
							this.draw3 = res.data.data.price.prize.name3;
							this.draw4 = res.data.data.price.prize.name4;
							this.draw5 = res.data.data.price.prize.name5;
							this.rules = res.data.data.rule;
							this.id = res.data.data.price.id;
						}else{
							this._showToast('暂无抽奖活动');
							setTimeout(() =>{
								uni.navigateBack({
									delta:1
								})
							},600)
						}
					})
				}
			})
		},
		onShow(){
			uni.getStorage({
				key: 'token',
				success: res =>{
					if(!res.data){
						this._showToast('请先登录');
						setTimeout(() =>{
							uni.navigateTo({
								url: '../minorPage/login'
							})
						},300)
					}
				},
				fail: err =>{
					this._showToast('请先登录');
					setTimeout(() =>{
						uni.navigateTo({
							url: '../minorPage/login'
						})
					},300)
				}
			})
		}
	}
</script>

<style>
	.icon-xiangzuo{
		position: absolute;
		top: 50%;
		left: 10upx;
		transform: translate(0,-50%);
		color: #FFFFFF;
		line-height: 150upx;
		font-size: 40upx;
		font-weight: 700;
	}
	.drax-box{
		margin-top: 140upx;
		width: 750upx;
		height: 700upx;
		background-image: url('~@/static/commimg/prizebg.jpg');
		background-repeat: no-repeat;
		/* background-position: center; */
		background-size: cover;
	}
	.drax-box .drax-title{
		text-align: center;
		color: #fd676d;
		font-size: 32upx;
		font-weight: 700;
		margin: 30upx 0 20upx;
	}
	.draw-img{
		position: relative;
	}
	.draw-img .draw{
		width: 550upx;
		border-radius: 50%;
		/* transition: transform 5s ease; */
	}
	.draw-img .pointer{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-60%);
		width: 120upx;
	}
	.rule{
		width: 700upx;
		height: 520upx;
		margin: auto;
		background-image: url('~@/static/commimg/rule.jpg');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
		padding-top: 150upx;
		box-sizing: border-box;
	}
	.rule .rule-content{
		width: 580upx;
		height: 320upx;
		margin: auto;
	}
</style>
