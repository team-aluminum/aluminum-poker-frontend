import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueQrcode from '@chenfengyuan/vue-qrcode'

import apiClient from '@/utils/ApiClient'
import Card from '@/components/Card'

Vue.config.productionTip = false

Vue.prototype.$utils = { apiClient }
Vue.component(VueQrcode.name, VueQrcode)
Vue.component('card', Card)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
