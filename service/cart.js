import require from './network.js';

export function getCartData(token,store_id){
	return require({
		url: '/api-pay/get-car',
		data: { token, store_id },
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

export function deleteGoodsCart(token,car_id){
	return require({
		url: '/api-pay/detele-car',
		data: { token, car_id },
		method: 'POST'
	})
}

export function reduceGoodsCart(token,car_id){
	return require({
		url: '/api-pay/reduce-car',
		data: { token, car_id },
		method: 'POST'
	})
}

export function createOrder(ids,store_id,token,amount){
	return require({
		url: '/api-pay/add-car-order',
		data: { ids,store_id,token,amount },
		method: 'POST'
	})
}

