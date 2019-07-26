import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component () { return import('@/views/Index.vue') }
    },
    {
      path: '/room',
      name: 'Room',
      component () { return import('@/views/Room.vue') }
    },
    {
      path: '/mobile/room',
      name: 'MobileRoom',
      component () { return import('@/views/mobile/Room.vue') }
    }
  ]
})
