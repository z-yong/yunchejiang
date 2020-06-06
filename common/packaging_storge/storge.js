export function getStorge(key){
	let value = '';
	uni.getStorage({
		key: key,
		success: res =>{
			if(res.data != undefined || res.data != null){
				value = res.data;
			}
		}
	})
	return value;
}
export function setStorge(key,data){
	uni.setStorage({
		key,
		data
	})
}