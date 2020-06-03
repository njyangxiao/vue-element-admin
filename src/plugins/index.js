// 插件模块
import router from '../router';
const plugin = {}

plugin.install = (Vue) => {

  // 4. 添加实例方法
  Vue.prototype.$loginOut = function () {
    Cookies.set('token', "", {
      expires: -1
    })
    Vue.prototype.$message('退出成功')
    setTimeout(() => {
      router.push({
        name: 'login'
      })
    }, 300);
  }
}

export default plugin