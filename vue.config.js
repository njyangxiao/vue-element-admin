module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  productionSourceMap: false,
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://apitp.votechn.com',
    //     changeOrigin: true,
    //   },
    //   '/interface': {
    //     target: 'http://apitp.votechn.com',
    //     changeOrigin: true
    //   }
    // }
  },
  lintOnSave: false,
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'vconsole': 'vconsole'
    }
  }
}