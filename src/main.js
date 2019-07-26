import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import apiClient from '@/utils/ApiClient'
import Card from '@/components/Card'

Vue.config.productionTip = false

Vue.prototype.$utils = { apiClient }
Vue.component('card', Card)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
