import Vue from 'vue'
import App from './App'
import $http from './service/request.js'
import { getStorge, setStorge} from './common/packaging_storge/storge.js'

const Jweixin = require('jweixin-module')

Vue.prototype.jweixin = Jweixin
Vue.prototype.$http = $http
Vue.prototype.getStorge = getStorge
Vue.prototype.setStorge = setStorge
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
