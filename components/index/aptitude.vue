<template>
	<view class="aptitude">
		<view class="apt-item" v-for="(item,index) in aptis" :key='index'>
			<view class="item-text">
				<view class="item-title">{{item.title}}</view>
				<view class="item-desc">{{item.desc}}</view>
			</view>
			<view class="item-icon">
				<image :src="item.icon" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			aptis: Array
		}
	}
</script>

<style>
	.aptitude{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-content: space-between;
		height: 338upx;
		background: #F8F8F8;
	}
	.aptitude .apt-item{
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 374upx;
		height: 168upx;
		background: #FFFFFF;
	}
	.aptitude .apt-item .item-text .item-title{
		font-size: 33upx;
	}
	.aptitude .apt-item .item-text .item-desc{
		font-size: 26upx;
		color: #fb722f;
		margin-top: 10upx;
		padding: 10upx;
		background: #fef1e9;
	}
	.aptitude .apt-item .item-icon{
		width: 100upx;
		height: 100upx;
	}
	.aptitude .apt-item .item-icon image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
</style>
