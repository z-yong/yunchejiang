import require from './network.js';

export function getGoodsDetail(token,id){
	return require({
		url: '/api-goods/get-product-detail',
		data: { token,id },
		method: 'POST'
	})
}

export function addGoodsCart(token,store_id,gid){
	return require({
		url: '/api-pay/add-car',
		data: { token,store_id,gid },
		method: 'POST'
	})
}

export function getCartNum(token,store_id,gid){
	return require({
		url: '/api-pay/car-num',
		data: { token,store_id,gid },
		method: 'POST'
	})
}

export function directCreateOrder(token,store_id,gid,amount){
	return require({
		url: '/api-pay/add-order',
		data: { token,store_id,gid,amount },
		method: 'POST'
	})
}