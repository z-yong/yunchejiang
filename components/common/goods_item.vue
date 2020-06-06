<template>
	<view class="goodsList" :class="isFlex ? 'df-goods-list' : 'no-df'">
		<view class="goods-item" v-for="(item,index) in goodsList" :key='index' @tap="goToDetail(item.id)"
			  :class="isFlex ? 'd-flex df-goods' : ''">
			<view class="goods-img text-center" :class="isFlex ? 'df-img' : ''" :style="{width: isFlex ? '240rpx' : '300rpx', height: isFlex ? '136rpx' : '170rpx'}" >
				<image :style="{width: isFlex ? '240rpx' : '300rpx', height: isFlex ? '136rpx' : '170rpx'}" :src="item.picture"></image>
			</view>
			<view class="goods-text" :class="isFlex ? 'df-text' : ''">
				<view class="goods-title d-flex j-sb a-center">
					<view>{{item.goods_name}}</view>
					<view v-if="isOrder" class="" style="font-weight: 600;">x {{item.num}}</view>
				</view>
				<!-- <view class="goods-desc">{{item.desc}}</view> -->
				<view class="goods-price">
					<text class="price-num">￥{{item.price}}</text>
					<view class="price-desc">销量: {{item.sales}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			goodsList: Array,
			isFlex: {
				type: Boolean,
				default: false
			},
			isOrder: {
				type: Boolean,
				default: false
			},
			isOrderDetail: {
				type: Boolean,
				default: false
			}
		},
		methods:{
			goToDetail(id){
				if(!this.isOrderDetail){
					uni.navigateTo({
						url: '../../pages/minorPage/goods_detail?id='+id
					})
				}else{
					this.$emit('goToOrderDetail')
				}
			}
		}
	}
</script>

<style>
	/* 332 384 */
	.goodsList{
		display: flex;
		padding: 0 36upx;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.goodsList.no-df .goods-item{
		width: 332upx;
		box-shadow: 2upx 2upx 14upx #f8f8f8, -2upx 0upx 4upx #f8f8f8;
		margin-top: 25upx;
		padding: 20upx 0upx 10upx;
	}
	.goodsList .goods-item .goods-img{
		text-align: center;
		margin: auto;
	}
	.goodsList .goods-item .goods-text{
		padding-left: 20upx;
	}
	.goodsList .goods-item .goods-title,
	.goodsList .goods-item .goods-desc{
		font-size: 26upx;
	}
	.goodsList .goods-item .goods-price{
		color: #ff1b0f;
		font-size: 24upx;
		/* margin-top: 30upx; */
	}
	.goodsList .goods-item .goods-price .price-num{
		font-size: 28upx;
		margin: 0 4upx;
		font-weight: 600;
	}
	.goodsList .goods-item .goods-price .price-desc{
		font-size: 24upx;
		color: #c5c5c5;
	}
	.df-img{
		width: 40%;
	}
	.df-text{
		width: 60%;
	}
	.df-goods-list{
		padding: 0 10rpx;
	}
	.goodsList .df-goods{
		width: 100%;
	}
	.goodsList.df-goods-list .goods-item{
		padding: 15rpx 0;
		border-bottom: 1rpx solid #F0F0F0;
	}
</style>
