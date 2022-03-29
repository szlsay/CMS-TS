import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入需要被组装的模块
import user from '@/store/userModule'
// 导入持久化 vuex 数据的插件，得到的 createPersistedState 是一个函数
// 作用：创建一个“持久化vuex数据的插件实例”
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  // 安装给 vuex 的插件
  plugins: [createPersistedState()],
  modules: {
    user
  },
  getters: {
    // 用来快速得到 token 的值
    token: state => state.user.token,
    // 用来快速访问用户的基本信息
    userinfo: state => state.user.info
  }
})
