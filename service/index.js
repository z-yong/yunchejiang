import require from './network.js';

export function getIndexBanner(store_id){
	return require({
		url: '/api-home/banner',
		data: { store_id }
	})
}

export function getIndexRecommend(store_id){
	return require({
		url: '/api-home/recommend',
		data: { store_id }
	})
}

export function getAllCartNum(token,store_id){
	return require({
		url: '/api-pay/car-num',
		data: { token,store_id },
		method: 'POST'
	})
}