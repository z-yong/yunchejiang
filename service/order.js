import require from './network.js';

export function getOrderData(token,store_id,status){
	return require({
		url: '/api-order/order-list',
		data: { token,store_id,status },
		method: 'POST'
	})
}

export function getOrderNum(token,store_id){
	return require({
		url: '/api-order/order-count',
		data: { token,store_id },
		method: 'POST'
	})
}

export function getOrderDetail(token,id){
	return require({
		url: '/api-order/order-detail',
		data: { token,id },
		method: 'POST'
	})
}


export function deleteOrder(token,id){
	return require({
		url: '/api-order/delete-order',
		data: { token,id },
		method: 'POST'
	})
}