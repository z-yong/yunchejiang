<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "/common/iconfont.css";
	@import "/common/uni.css";
	@import "/common/common.css";
	@import "/common/z-main.css";
	page{
		height: 100%;
	}
	uni-checkbox .uni-checkbox-input{
		border-radius: 50% !important;
	}
	.uni-checkbox-input.uni-checkbox-input-checked{
		background: #4566f3 !important;
	}
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before{
		color: #FFFFFF !important;
	}
	body{
		width: 750rpx;
		height: 100%;
		box-sizing: border-box;
	}
	uni-page-body{
		width: 750rpx;
		height: 100%;
	}
	.box-shadow{
		box-shadow: 1upx 20upx 10upx 0 #F8F8F8;
		width: 690upx;
		background: #FFFFFF;
		border-radius: 20upx;
	}
	.list-title{
		font-size: 32upx;
		color: #666;
	}
</style>
