import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/reg', component: () => import('@/views/Reg/Reg.vue') },
  { path: '/login', component: () => import('@/views/Login/Login.vue') },
  // 404 页面的路由规则
  { path: '/404', component: () => import('@/views/404.vue') },
  {
    path: '/',
    component: () => import('@/views/Main/Main.vue'),
    redirect: '/home',
    children: [
      // 子路由
      // 注意：子路由的 path 有两种写法：
      // 1. 完整写法：父 + 子
      // 2. 简化写法：子，同时子路由的 path 不能以 / 开头
      { path: 'home', component: () => import('@/views/Home/Home.vue') },
      { path: 'user-info', component: () => import('@/views/User/UserInfo.vue') },
      { path: 'user-avatar', component: () => import('@/views/User/UserAvatar.vue') }
    ]
  },
  // 添加 * 所表示的通配符路由规则，表示如果输入的路径，在上面匹配不到要展示的组件，
  // 则自动重定向到 /404 这个路由地址
  { path: '*', redirect: '/404' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 定义全局前置导航守卫，进行路由权限的判断
// 只要发生了路由的导航跳转，必然会触发 beforeEach 中的回调函数
// 形参中的 to，表示将要访问的，路由的信息对象
router.beforeEach((to, from, next) => {
  // 获取 token 的值
  const token = store.getters.token
  if (to.path === '/reg' || to.path === '/login' || to.path === '/404') {
    // 如果访问的是登录页面，而且有 token，则强制去后台主页
    if (to.path === '/login' && token) {
      // 免登录
      next('/')
    } else {
      next()
    }
  } else {
    // 访问的是有权限的页面，必须先登录，才能放行
    // 判断用户是否登录了
    if (token) {
      // 放行
      next()
    } else {
      // 强制跳转到登录页面
      next('/login')
    }
  }
})

export default router
