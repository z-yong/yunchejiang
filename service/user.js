import require from './network.js';

export function postPassLogin(tel,userpwd,url){
	return require({
		url: '/api-login/pwd-login',
		method: 'POST',
		data: {tel,userpwd,url }
	})
}

export function postCodeLogin(tel,code,url){
	return require({
		url: '/api-login/code-login',
		method: 'POST',
		data: { tel,code,url }
	})
}

export function getCode(tel){
	return require({
		url: '/api-login/get-dx',
		method: 'POST',
		data: {tel}
	})
}

export function getUrl(){
	return require({
		url: '/api-login/get-code'
	})
}

export function getOpenid(code){
	return require({
		url: '/api-login/get-openid',
		data: { code }
	})
}

export function userRegister(tel, userpwd, realname, openid, code, code2){
	return require({
		url: '/api-login/register',
		data: { tel, userpwd, realname, openid, code, code2 },
		method: 'POST'
	})
}

export function postStoreId(store_id){
	return require({
		url: '/api-login/get-store-id',
		data: { store_id }
	})
}

export function amendAccountMess(token,realname,oldpwd,userpwd){
	return require({
		url: '/api-user/update-user',
		data: { token,realname,oldpwd,userpwd },
		method: 'POST'
	})
}

export function getAccountMess(token){
	return require({
		url: '/api-user/get-name',
		data: { token },
		method: 'POST'
	})
}