import require from './network.js';

export function getActiveList(token,store_id){
	return require({
		url: '/api-active/active-list',
		data: { token, store_id },
		method: 'POST'
	})
}

export function getDrawList(token,store_id){
	return require({
		url: '/api-turntable/prize-list',
		data: { token, store_id },
		method: 'POST'
	})
}

export function getCommission(token){
	return require({
		url: '/api-active/commission',
		data: { token },
		method: 'POST'
	})
}