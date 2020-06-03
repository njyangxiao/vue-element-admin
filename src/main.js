import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api';
import ElementUI from 'element-ui';
import plugin from '@/plugins';
import moment from 'moment';
//导入自定义组件 是一个对象
import navCrumbs from "@/components/navCrumbs"
// 导入表格树
import TreeTable from 'element-tree-grid'
// import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element-variables.scss'
import "@/assets/css/base.scss";

Vue.config.productionTip = false

// 使用element
Vue.use(ElementUI);
//使用插件
Vue.use(plugin);
//判断是否登录
router.beforeEach((to, from, next) => {
  var token = Cookies.get('token')
  if (!token && to.name != 'login') {
    next({
      name: 'login'
    })
  } else {
    next()
  }
})


//全局过滤器
Vue.filter('formatData', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

//全局自定义组件
Vue.component(navCrumbs.name, navCrumbs)
Vue.component('tree-table', TreeTable)
// 后台api接口 全局注册
Vue.use(api)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')