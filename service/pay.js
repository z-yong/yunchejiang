import require from './network.js';

export function getOrderData(token,order_num){
	return require({
		url: '/api-pay/order-detail',
		data: { token, order_num },
		method: 'POST'
	})
}

export function getAddressList(token){
	return require({
		url: '/api-address/get-all-address',
		data: { token },
		method: 'POST'
	})
} 

export function getIdAddress(token,id){
	return require({
		url: '/api-address/get-address',
		data: { token,id },
		method: 'POST'
	})
}

export function addAddressList(token,tel,address,name,status){
	return require({
		url: '/api-address/address',
		data: { token,tel,address,name,status },
		method: 'POST'
	})
}

export function updataAddressList(token,tel,address,name,status,id){
	return require({
		url: '/api-address/update-address',
		data: { token,tel,address,name,status,id },
		method: 'POST'
	})
}

export function deleteAddressList(token,id){
	return require({
		url: '/api-address/detele-address',
		data: { token,id },
		method: 'POST'
	})
}

export function submitOrder(token,address_id,order_num,money,content,pay_type,coupon_id,coupon_money){
	return require({
		url: '/api-pay/pay',
		data: { token,address_id,order_num,money,content,pay_type,coupon_id,coupon_money },
		method: 'POST'
	})
}

export function orderResult(token,id){
	return require({
		url: '/api-address/detele-address',
		data: { token,id },
		method: 'POST'
	})
}