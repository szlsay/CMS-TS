// 这个模块，用来封装 axios
// 1. 导入 axios
import axios from 'axios'
// import { AxiosError, AxiosRequestConfig } from 'axios'
// 按需导入弹框的组件
import { Message, Loading } from 'element-ui'
// 导入 vuex 的 store 模块
import store from '@/store'
// 导入 router 模块
import router from '@/router'
import { ElLoadingComponent } from 'element-ui/types/loading'
// 2. 调用 axios.create()
const request = axios.create({
  // 求大家了：千万不要手敲，前后不要多空格
  baseURL: 'http://www.liulongbin.top:3008'
})
let loadingInstance: ElLoadingComponent
// 为步骤2得到的 request 对象，提供请求拦截器
// request.interceptors.request.use(fn1, fn2)
// config 中存储着本次请求所有的信息
// 请求的 url 地址
// 请求的 method 方式
// 请求头 headers

request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 在这里展示 loading 效果
  loadingInstance = Loading.service({
    text: '数据加载中...',
    background: 'rgba(0, 0, 0, 0.8)'
  })
  config = config || {}
  config.headers = config.headers || {}
  // 全局添加 token
  // console.log(config)
  // console.log(store)
  // 如果请求的 URL 地址，以 /my 开头，则添加 token
  if (config.url?.startsWith('/my')) {
    // 注意：等号的后面，要给一个真正的 token 值
    // 登录成功以后，token 值被存储到 vuex 中
    // config.headers.Authorization = store.state.user.token
    config.headers.Authorization = store.getters.token
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 为步骤2得到的 request 对象，提供响应拦截器
// 注意，把官方代码拿过来之后，一定要把 axios 替换为步骤2得到的 request
// request.interceptors.response.use(fn1, fn2)
request.interceptors.response.use(function (response) {
  // 响应成功，需要隐藏 loading
  loadingInstance.close()
  // 如果响应状态码是 2xx，则执行这个成功的 function 回调
  // 1. 结构出 data 以后，只能证明这次请求完成了，但是具体有没有成功， 不知道
  // 2. 咱们可以判断 data.code 是否等于 0，来知晓是否成功
  const { data } = response
  console.log('response', response)
  if (data.code === 0) {
    // 这次业务成功啦
    return response
  } else {
    // 这次业务失败啦
    // 1. 提示错误消息
    Message.error(data.message)
    // 2. 把这次 axios 请求标记为失败
    return Promise.reject(new Error(data.message + data.code))
  }
}, function (error) {
  // 响应失败，也需要隐藏 loading
  loadingInstance.close()
  // 如果调用接口的时候，提供的请求体数据不完整，
  // 或者查询参数不完整，会触发失败的回调
  // 如果响应状态码不是以 2xx 开头的，则执行失败的回调
  // 如果想要看错误对象的信息，需要用 console.dir() 来打印
  console.dir(error)
  // 这里最好加上条件判断，防止属性的值不存在
  if (error.response && error.response.data) {
    Message.error(error.response.data.message)
  }

  // 判断失败的状态码是否为 401，如果是，则：
  // 1. 清空 vuex 中那个无效的 token
  // 2. 清空 vuex 中用户的信息
  // 3. 强制用户跳转到登录页面
  if (error.response && error.response.status === 401) {
    store.commit('user/updateToken', '')
    store.commit('user/updateInfo', {})
    router.push('/login')
  }

  return Promise.reject(error)
})

// 3. 把步骤2生成的 axios 实例，导出
export default request
