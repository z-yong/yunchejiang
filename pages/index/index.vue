<template>
	<view class="index-wrapper">
		<!-- 首页大图 -->
		<z-index-bg :banner='banner' />
		<!-- 菜单分类 -->
		<z-class-menu :menuList="menuList" /> 
		 <!-- 分割线 --> 
		<z-cut/>
		 <!-- 商家资质 -->
		<!-- <z-aptitude :aptis="aptis"/> -->
		<!-- 分割线 --> 
		<z-cut/>
		<!-- 智能推荐 -->
		<z-recommend :goodsList='goodsList'/>
	</view>
</template>

<script>
	import indexBg from "@/components/index/indexBg.vue"
	import classMenu from "@/components/index/classMenu.vue"
	import cut from "@/components/common/cut.vue"
	import aptitude from "@/components/index/aptitude.vue"
	import recommend from "@/components/common/recommend.vue"
	
	import { getIndexBanner, getIndexRecommend, getAllCartNum } from '../../service/index.js'
	export default {
		components:{
			"z-index-bg": indexBg,
			"z-class-menu": classMenu,
			"z-cut": cut,
			"z-aptitude": aptitude,
			"z-recommend": recommend
		},
		data() {
			return {
				banner: [],
				http: 'http://yun.90plus.cn/',
				menuList: [
					{img: "/static/index/menu3.png", text: '转盘抽奖'},
					{img: "/static/index/menu4.png", text: '活动营销'},
					// {img: "/static/index/menu1.png", text: '轮胎选购'},
					// {img: "/static/index/menu2.png", text: '安装维修'},
					{img: "/static/index/menu1.png", text: '认证商家'}
				],
				aptis: [{title: '上榜商家',desc: '这些商家榜上有名',icon: '/static/index/iden1.png'},
						{title: '诚信联盟',desc: '货不对板 5天包退',icon: '/static/index/iden2.png'},
						{title: '认证商家',desc: '车源真实有保证',icon: '/static/index/iden3.png'},
						{title: '特惠车源',desc: '特价车限时抢',icon: '/static/index/iden4.png'}],
				goodsList: []
			}
		},
		onLoad() {
			this._changeTitleNView()
			const href = window.location.href;
			const index = href.indexOf('?') + 1;
			if(index > 0){
				const argument = href.slice(index);
				if(argument.length){
					const reg = /([^?&=]+)=([^?&=|#]*)/g;
					const arr = argument.match(reg);
					let store_id = ''; 
					arr.forEach((ele) =>{
						const i = ele.indexOf('=');
						const name = ele.slice(0,i)
						if(name == 'store_id'){
							store_id = ele.slice(i+1)
						}
					})
					if(reg.test(argument)){
						if(store_id != ''){
							uni.setStorage({
								key: 'user_id',
								data: store_id
							});
						}
					}
				}
			}
			uni.getStorage({
				key: 'user_id',
				success: res =>{
					const store_id = res.data;
					getIndexBanner(res.data).then(res =>{
						if(res.data.status == 200){
							res.data.data.forEach(ele =>{
								this.banner.push(ele);
							})
						}
					})
					getIndexRecommend(res.data).then(res =>{
						if(res.data.status == 200){
							this.goodsList = res.data.data;
						}
					})
					this._getAllCartNum()
				}
			})
		},
		methods: {
			_changeTitleNView(){
				// #ifdef APP-PLUS  
				const webView = this.$mp.page.$getAppWebview();  
				// 修改buttons  
				// index: 按钮索引, style {WebviewTitleNViewButtonStyles }  
				// webView.setTitleNViewButtonStyle(0, {  
				//     text: 'hello',  
				// });  
				// 修改按钮上的角标  
				// index: 按钮索引, text: 角标文本内容  
				// webView.setTitleNViewButtonBadge({  
				//     index: 0,  
				//     text: 10,  
				// });  
				// 设置 searchInput的 focus  
				// focus: true | false  
				webView.setTitleNViewSearchInputFocus(true)  
				// 设置 searchInput的 text  
				// webView.setTitleNViewSearchInputText('text')  
				// searchInput 通过 webview 的 setStyle 方法进行更新  
				const tn = webView.getStyle().titleNView;  
				// if (tn.buttons) {    
					uni.getSystemInfo({    
						success:function(res){
							if (res.platform=="ios") { // 这里在HBuilderX 1.9.9版本有个bug，searchInput的I变小写了 ，临时绕过下。更高版本会修复此bug    
								tn.searchInput.placeholder = '热门汽车好物wu';    
								webView.setStyle({    
									titleNView: tn    
								});    
							} else{    
								tn.searchInput.placeholder = '热门汽车好物5'; //这里有个已知bug，HBuilderX 1.9.9上，当searchInput位于首页时，动态设置placehold会导致buttons的点击事件消失。更高版本会修复此bug    
								webView.setStyle({    
									titleNView: tn    
								});    
							}    
						}    
					})    
				// } 
				// #endif
			},
			_getAllCartNum(){
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						uni.getStorage({
							key: 'user_id',
							success: res =>{
								getAllCartNum(token,res.data).then(res =>{
									if(res.data.status == 200){
										const cartNum = String(res.data.data);
										console.log(cartNum)
										uni.setStorage({
											key: 'cartNum',
											data: cartNum
										})
										if(res.data.data != 0){
											uni.setTabBarBadge({
											  index: 2,
											  text: cartNum
											})
										}else{
											uni.removeTabBarBadge({
												index: 2
											})
										}
									}else{
											uni.removeTabBarBadge({
												index: 2
											})
										}
								})
							}
						})
					}
				})
			},
		},
		onNavigationBarSearchInputClicked(){
			console.log(111)
		},
		onBackPress(){
			uni.getStorage({
				key: 'tel',
				success: res =>{
					const tel = res.data;
					uni.showModal({
						title: '提示',
						content: '确认返回登录页?',
						success: res =>{
							if(res.confirm){
								uni.navigateTo({
									url: '../minorPage/login?tel='+tel
								})
							}else{
								return true;
							}
						}
					})
				}
			})
			return true
		},
		onShow(){
			this._getAllCartNum()
		}
	}
</script>

<style>
	.index-wrapper{
		padding-bottom: 100rpx;
	}
</style>
