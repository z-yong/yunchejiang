import { getStorge } from '@/common/packaging_storge/storge.js'

export default {
	// 全局配置
	common:{
		baseUrl:"http://yun.90plus.cn",
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		},
		data:{},
		method:'GET',
		dataType:'json'
	},
	// 请求 返回promise
	request(options = {}){ 
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		// token
		if (options.token) {
			options.data.token = getStorge('token')
			// 二次验证
			if (!options.data.token) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return uni.navigateTo({
					url: '/pages/minorPage/login',
				});
			}
		}
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 服务端失败
					if(result.data.status !== 200){
						uni.showToast({
							title: result.data.msg || '服务端失败',
							icon: 'none'
						});
						return rej() 
					}
					// 成功
					if(options.msg){
						uni.showToast({
							title: result.data.msg || options.msg,
							icon: 'none'
						});
					}
					let data = result.data.data
					res(data)
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}