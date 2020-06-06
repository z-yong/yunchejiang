<template>
	<view class="d-flex main-border-bottom p-2">
		<view class="font-lg">{{title}}</view>
		<slot/>
	</view>
</template>

<script>
	export default{
		props:{
			title: String
		}
	}
</script>

<style>
</style>
