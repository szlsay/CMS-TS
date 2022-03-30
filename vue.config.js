module.exports = {
  // 如果 publicPath 的值是字符串 '/' 的话，不允许直接以 file 查看打包出来的页面效果，
  // 只能部署到 http 或 https 协议下，才能看到网站效果。注意：'/' 是默认值。
  // 如果想直接以 file 协议，查看打包完毕后的页面效果，需要把 publicPath 的值设置为 '' 或 './'
  publicPath: '',
  // webpack 的打包配置项
  configureWebpack: {
    // externals 表示打包时候的排除项
    externals: {
      // 要排除的包的名字: Window全局的对象名称
      echarts: 'echarts',
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'vuex-persistedstate': 'createPersistedState',
      axios: 'axios',
      dayjs: 'dayjs',
      'quill-vuejs': 'VueQuillEditor'
    }
  }
}
