<template>
	<view class="navbar position-relative" :style="{background: bgColor}">
		<slot name="left"/>
		<view class="title" :style="{color: titleColor}">
			{{title}}
			<slot name="cen"/>
		</view>
		<slot name="right"/>
	</view>
</template>

<script>
	export default{
		props: {
			title: String,
			bgColor: {
				type: String,
				default: '#4566f3'
			},
			titleColor: {
				type: String,
				default: '#FFFFFF'
			}
		}
	}
</script>

<style>
	.navbar{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		z-index: 9999;
	}
	.navbar .title{
		width: 100%;
		height: 140upx;
		line-height: 150upx;
		font-weight: 600;
		text-align: center;
		font-size: 36upx;
	}
</style>
