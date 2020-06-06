<template>
	<view class="p-2" style="background: #F7F7F7; height: 100%;padding-bottom: 100rpx;">
		<z-back-icon/>
		<view v-if="recordsList.length == 0" class="text-center mt-4" style="color: #888888;">暂无纪录。。。</view>
		<view v-for="(item,index) in recordsList" :key='index' class="mb-2 px-2 pb-1" style="background: #FFFFFF;border-radius: 10rpx;margin-top: 50rpx;">
			<view class="py d-flex j-sb a-center main-border-bottom" style="color: #666666;">
				<view class="">{{item.add_time}}</view>
				<view v-if="title != '佣金纪录'" class="">{{item.sss}}</view>
			</view>
			<view v-if="path == 'draw'" class="">
				<view class="" style="color: #dd5a47;">
					<text>{{item.grade}}:</text><text class="ml-1">{{item.name}}</text>
				</view>
				<view  class="font" style="color: #999999;">核销码<text class="ml-1">{{item.code}}</text></view>
			</view>
			<view v-if="path == 'activy'" class="">
				<view class="">
					<text>活动名称:</text><text class="ml-1">{{item.active_name}}</text>
				</view>
				<view  class="font">
					<text>车牌号</text><text class="ml-1">{{item.car_num}}</text>
				</view>
				<view class="font" style="color: #dd5a47;">
					<text>活动优惠价</text><text class="ml-1">￥{{item.active_price}}</text>
				</view>
				<view class="font" style="color: #dd5a47;">
					<text>核销码</text><text class="ml-1">{{item.code}}</text>
				</view>
			</view>
			<view v-if="path == 'commission'" class="d-flex j-sb">
				<view class="" style="color: #555555;">
					<text class="font-lg">{{item.type == 1 ? '活动获得佣金' : '商城获得佣金'}}</text>
				</view>
				<view  class="font d-flex flex-column a-end">
					<view class="ml-1" style="color: #555555;">+{{item.money}}</view>
					<view class="ml-1" style="color: #999999;">{{item.money}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import backIcon from "@/components/common/back_page.vue"
	import { getActiveList, getDrawList, getCommission } from '../../service/records.js'
	export default{
		components:{
			"z-back-icon": backIcon
		},
		data(){
			return {
				path: '',
				title: '',
				recordsList: [],
				recordsList1: [],
				recordsList2: []
			}
		},
		methods:{
			_getActiveList(text){
				uni.getStorage({
					key: 'token',
					success: res =>{
						const token = res.data;
						uni.getStorage({
							key: 'user_id',
							success: res =>{
								if(text == 'activy'){
									getActiveList(token,res.data).then(res =>{
										this.recordsList = res.data.data;
										this.recordsList.forEach(ele =>{
											if(ele.status == 1){
												ele.sss = '未支付'
											}else if(ele.status == 2){
												ele.sss = '待核销'
											}else{
												ele.sss = '已核销'
											}
										})
									})
								}else if(text == 'draw'){
									getDrawList(token,res.data).then(res =>{
										this.recordsList = res.data.data;
										this.recordsList.forEach((ele,index) =>{
											if(ele.status == 1){
												ele.sss = '待核销'
											}else{
												ele.sss = '已核销'
											}
											if(ele.level == 1){
												ele.grade = '一等奖'
											}else if(ele.level == 2){
												ele.grade = '二等奖'
											}else if(ele.level == 3){
												ele.grade = '三等奖'
											}else if(ele.level == 4){
												ele.grade = '四等奖'
											}else if(ele.level == 5){
												ele.grade = '五等奖'
											}
										})
									})
								}else if(text == 'commission'){
									getCommission(token).then(res =>{
										console.log(res)
										this.recordsList = res.data.data;
									})
								}
							}
						})
					}
				})
			}
		},
		onLoad(option){
			this.path = option.path;
			if(option.path == 'draw'){
				this.title = '中奖纪录';
				uni.setNavigationBarTitle({
					title: '中奖纪录'
				})
				this._getActiveList('draw')
			}else if(option.path == 'activy'){
				this.title = '活动纪录';
				uni.setNavigationBarTitle({
					title: '活动纪录'
				})
				this._getActiveList('activy')
			}else if(option.path == 'commission'){
				this.title = '佣金纪录';
				uni.setNavigationBarTitle({
					title: '佣金纪录'
				})
				this._getActiveList('commission')
			}
		}
	}
</script>

<style>
</style>
