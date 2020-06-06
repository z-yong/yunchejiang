import require from './network.js';

export function getMarketData(active_id){
	return require({
		url: '/api-home/active-detail',
		data: { active_id }
	})
}

export function payment(token, store_id, active_id, car_num, tel,type){
	return require({
		url: '/api-active/active-create',
		data: { token, store_id, active_id, car_num, tel,type },
		method: 'POST'
	})
}

export function getPackage(url){
	return require({
		url: '/api-share/sign-package',
		data: { url }
	})
}

export function getUrl(token,store_id,active_id){
	return require({
		url: '/api-share/share-link',
		data: { token, store_id,active_id },
		method: 'POST'
	})
}

export function postStoreId(store_id){
	return require({
		url: '/api-login/get-store-id',
		data: { store_id }
	})
}

export function getState(){
	return require({
		url: '/api-pay/add-car',
		method: 'POST'
	})
}

export function getTableData(store_id,active_id){
	return require({
		url: '/api-home/all-active-list',
		data: {store_id,active_id},
		method: 'POST'
	})
}

export function getShareMess(store_id){
	return require({
		url: '/api-home/banner',
		data: {store_id}
	})
}