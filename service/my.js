import require from './network.js';

export function getMyData(token,store_id){
	return require({
		url: '/api-user/get-info',
		data: { token,store_id },
		method: 'POST'
	})
}

export function getPrice(token,money,account,nickname){
	return require({
		url: '/api-user/ti-x',
		data: { token,money,account,nickname },
		method: 'POST'
	})
}

export function getPriceList(token){
	return require({
		url: '/api-user/tx-list',
		data: { token },
		method: 'POST'
	})
}
//升级店铺
export function createStore(token,name,license_img,address){
	return require({
		url: '/api-user/create-store',
		data: { token,name,license_img,address },
		method: 'POST'
	})
}
//忘记密码
export function forgetPwd(tel,code,pwd){
	return require({
		url: '/api-login/forget-pwd',
		data: { tel,code,pwd },
		method: 'POST'
	})
}
//添加搜索记录
export function createSearch(token,store_id,keyword){
	return require({
		url: '/api-user/post-search',
		data: { token,store_id,keyword },
		method: 'POST'
	})
}
//查找搜索记录
export function Search(token,store_id){
	return require({
		url: '/api-user/search',
		data: { token,store_id },
		method: 'POST'
	})
}
//查找搜索商品
export function searchGoods(store_id,goods_name){
	return require({
		url: '/api-goods/search-goods',
		data: { store_id,goods_name }
	})
}
//查找活动列表
export function getActiveList(store_id){
	return require({
		url: '/api-home/all-active',
		data: { store_id }
	})
}