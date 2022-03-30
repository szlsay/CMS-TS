import { Module, VuexModule, Mutation, MutationAction } from 'vuex-module-decorators'
import request from '@/utils/request'
import store from '@/store'
import type { UserInfo } from '@/types/user'
@Module({ namespaced: true, name: 'user', store })
export default class UserModule extends VuexModule {
  // 登录成功之后的 token
  token = ''
  // 用户的基本信息对象
  info = {}

  // 建议遵守如下的命名规范：
  // 要给谁赋值，就把函数名，命名为 updateXXX
  @Mutation
  updateToken (token: string) {
    this.token = token
  }

  // 更新 state 中 info 的数据
  // 形参中的 obj 就是 Ajax 请求回来的用户信息对象
  @Mutation
  updateInfo (info: UserInfo) {
    this.info = info
  }

  // 异步操作
  @MutationAction
  async initUserInfo () {
    const { data } = await request.get('/my/userinfo')
    return { info: data.data }
  }
}
