import require from './network.js';

export function getClassifyData(store_id){
	return require({
		url: '/api-goods/get-all-cate',
		data: { store_id }
	})
}