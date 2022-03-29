import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/reg', component: () => import('@/views/Reg/Reg.vue') },
  { path: '/login', component: () => import('@/views/Login/Login.vue') },
  { path: '/', component: () => import('@/views/Main/Main.vue') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
