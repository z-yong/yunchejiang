<template>
	<view class="search-wrapper">
		<view v-if="!goodsShow && mySearchList" class="">
			<!-- 热门搜索 -->
		<!-- 	<z-search-list title='热门搜索' :searchList='hotList' @searchData='searchContent($event)'/> -->
			<!-- 我搜过的 -->
			<z-search-list title='我搜过的' :searchList='mySearchList' @searchData='searchContent($event)'/>
		</view>
		<view v-if="goodsShow" class="mt-2">
			<z-goods-list :goodsList='goodsLists' isIndex/>
		</view>
	</view>
</template>

<script>
	import searchList from '@/components/common/searchList.vue'
	import goodsList from "@/components/common/goods_item.vue"
	import{ createSearch , searchGoods , Search } from '../../service/my.js'
	import { getStorge } from '../../common/packaging_storge/storge.js'
	// import { searchGoods, searchData } from '../../service/search.js' 
	export default{
		components:{
			"z-search-list": searchList,
			"z-goods-list": goodsList
		},
		data(){
			return{
				goodsShow: false,
				goodsLists: [],
				// hotList: [{content: '打车'},{content: '打车'},{content: '打车'}],
				mySearchList: []
			}
		},
		// 文本内容变化
		// onNavigationBarSearchInputChanged(e){
		// 	console.log(e)
		// },
		// 点击搜索
		onNavigationBarSearchInputConfirmed(e){
			const text = e.text;
			if(text){
				this._getGoods(text)
				this._createSearch(text)
			}
		},
		onNavigationBarSearchInputChanged(e){
			var text = e.text;
			if(text){
				this._getGoods(text)
			}
		},
		onNavigationBarSearchInputClicked(){
			this.goodsLists = false;
		},
		methods:{
			searchContent(e){
				this._getGoods(e)
			},
            //搜索出来的商品
			_getGoods(text){
				const store_id = getStorge('user_id')
				if(store_id){
					searchGoods(store_id,text).then(res =>{
						if(res.data.status == 200){
							this.goodsShow = true
							this.goodsLists = res.data.data
						}else{
							this._showToast(res.data.msg)
						}
					})
				}
			},
			//添加搜索记录
			_createSearch(text){
				const token = getStorge('token')
				const store_id = getStorge('user_id')
				if(token && store_id && text){
					createSearch(token,store_id,text).then(res =>{
						//不用展示任何信息
					})
				}
			},
			//查找搜索记录
			_Search(){
				const token = getStorge('token')
				const store_id = getStorge('user_id')
				if(token && store_id){
					Search(token,store_id).then(res =>{
						if(res.data.status == 200){
							console.log()
							this.mySearchList = res.data.data
						}else{
							this.mySearchList = []
						}
					})
				}
			},
			_showToast(text){
				uni.showToast({
					title: text,
					icon: 'none'
				})
			},
		},
		onShow(){
			
		},
		onLoad(){
			this._Search();
		}
	}
</script>

<style>
</style>
