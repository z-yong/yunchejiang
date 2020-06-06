import {
  baseURL
} from './config.js'

export default function (options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      data: options.data || {},
      method: options.method || 'get',
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      success: resolve,
      fail: reject
    })
  })
}