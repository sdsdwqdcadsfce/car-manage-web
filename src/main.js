import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
axios.interceptors.request.use(config=>{
  config.headers.token=window.sessionStorage.getItem('token');
  return config;
})
// axios.defaults.baseURL='http://49.233.93.180:7000/'
axios.defaults.baseURL='http://127.0.0.1:7000/'
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
