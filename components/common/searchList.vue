<template>
	<view class="p-2">
		<view class="search-title">{{title}}</view>
		<view class="search-list d-flex flex-wrap">
			<view v-for="(item,index) in searchList" :key='index' class="d-flex a-center j-center ml-2 mt-2" @tap="searchContent(item.keyword)"
				  style="background: #F7F7F7; padding: 8upx 25upx; border-radius: 20upx;">
				<text>{{item.keyword}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			searchList: Array,
			title: String
		},
		methods:{
			searchContent(content){
				this.$emit('searchData',content)
			}
		}
	}
</script>

<style>
</style>
