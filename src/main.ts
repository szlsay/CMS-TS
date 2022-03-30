import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 导入 elementUI 和配套的样式表
import ElementUI from 'element-ui'
// 导入富文本编辑器的插件和配套的样式
import VueQuillEditor from 'quill-vuejs'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'element-ui/lib/theme-chalk/index.css'
// 导入自己的样式表，覆盖 elementUI 的样式
// 注意：在 js 中，import 导入相关的代码，必须放到最顶部的位置
import '@/assets/global.less'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
// 把 elementUI 安装为 Vue 的插件
// 在每个 .vue 的组件中，可以直接使用 element 提供的组件啦
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
