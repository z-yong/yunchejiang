import require from './network.js';

export function getDrawInfo(token,store_id){
	return require({
		url: '/api-turntable/prize-count',
		data: { token, store_id },
		method: 'POST'
	})
}

export function getDrawMess(store_id){
	return require({
		url: '/api-home/turntable-rule',
		data: { store_id }
	})
}

export function getDrawPrize( name, level, token, store_id, price_id ){
	return require({
		url: '/api-turntable/prize-create ',
		data: { name, level, token, store_id, price_id },
		method: 'POST'
	})
}