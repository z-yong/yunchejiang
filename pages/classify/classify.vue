<template>
	<view class="classify-wrapper">
		<view class="classify-content">
			<scroll-view class="content-left" scroll-y="true" >
				<view class="left-item" v-for="(itemL,iL) in goodsList" :key='iL'
					  :class="currentLeftIndex == iL ? 'left-acitve' : ''" @click="changeMenuLeft(iL)">
					<view>{{itemL.name}}</view>  
				</view>
			</scroll-view>
			<scroll-view class="content-right" scroll-y="true" >
				<!-- <z-sift title='精选分类' icon='/static/classify/sift.png' :menuSift='menuSift'/>
				<z-sift title='推荐品牌' icon='/static/classify/recomm.png' :menuSift='menuReco'/> -->
				<z-goods :goodsList='goodsList[currentLeftIndex].goods' isFlex/>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import sift from "@/components/common/sift.vue"
	import goods from "@/components/common/goods_item.vue"
	import { getClassifyData } from '../../service/classify.js'
	
	export default{
		components:{
			"z-sift": sift,
			"z-goods": goods
		},
		data(){
			return{
				currentLeftIndex: 0,
				menuLeftList: ['电子电器','美容精洗','汽车装饰','维修保养','安全自驾','轮胎轮毂','升级改装','电子电器','美容精洗','汽车装饰','维修保养','安全自驾','轮胎轮毂','升级改装'],
				goodsList: []
			}
		},
		methods:{
			changeMenuLeft(index){
				this.currentLeftIndex = index;
			},
			_changePlaceholder(){
				// #ifdef APP-PLUS  
				const webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewSearchInputFocus(true)  
				// 设置 searchInput的 text  
				// webView.setTitleNViewSearchInputText('text')  
				// searchInput 通过 webview 的 setStyle 方法进行更新  
				const tn = webView.getStyle().titleNView;  
				// if (tn.buttons) {    
					uni.getSystemInfo({    
						success:function(res){    
							if (res.platform=="ios") { // 这里在HBuilderX 1.9.9版本有个bug，searchInput的I变小写了 ，临时绕过下。更高版本会修复此bug    
								tn.searchInput.placeholder = '热门汽车物';    
								webView.setStyle({    
									titleNView: tn    
								});    
							} else{    
								tn.searchInput.placeholder = '热门汽车物'; //这里有个已知bug，HBuilderX 1.9.9上，当searchInput位于首页时，动态设置placehold会导致buttons的点击事件消失。更高版本会修复此bug    
								webView.setStyle({    
									titleNView: tn    
								});    
							}    
						}    
					})    
				// } 
				// #endif
			}
		},
		onLoad(){
			this._changePlaceholder()
			const store_id = this.getStorge('user_id');
			getClassifyData(store_id).then(res =>{
				if(res.data.status == 200){
					this.goodsList = res.data.data
				}
			})
		},
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url: '../minorPage/search_page'
			})
		}
	}
</script>

<style>
	.classify-wrapper{
		height: 100%;
	}
	.classify-content{
		display: flex;
		height: 100%;
	}
	.classify-content .content-left{
		width: 25%;
		background: #f8f8f8;
		height: 100%;
	}
	.classify-content .content-left .left-item{
		padding: 30upx 0;
		width: 100%;
		text-align: center;
		font-size: 30upx;
		box-sizing: border-box;
	}
	.classify-content .content-left .left-item view{
		border-left: 10upx solid #fff;
	}
	.classify-content .content-left .left-item.left-acitve view{
		border-left: 10upx solid #4566f3;
		color: #4566f3;
	}
	.classify-content .content-right{
		width: 75%;
		height: 100%;
	}
</style>
