export default new VueRouter({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login', //登录
    component: () => import('@/views/login/index.vue'),
    meta: {},
  }, {
    path: '/',
    name: 'home', //首页
    component: () => import('@/views/home/index.vue'),
    meta: {},
    children: [{
      path: '/users',
      name: 'users', //用户列表
      component: () => import('@/components/users/index.vue'),
      meta: {},
    }, {
      path: '/rights',
      name: 'rights', //权限列表
      component: () => import('@/components/power/rights.vue'),
      meta: {},
    }, {
      path: '/roles',
      name: 'roles', //角色列表
      component: () => import('@/components/power/roles.vue'),
      meta: {},
    }, {
      path: '/goods',
      name: 'goods', //商品列表
      component: () => import('@/components/goods/goodsList.vue'),
      meta: {},
    }, {
      path: '/goods/add',
      name: 'goodsAdd', //添加商品
      component: () => import('@/components/goods/add.vue'),
      meta: {},
    }, {
      path: '/params',
      name: 'params', //商品参数
      component: () => import('@/components/goods/params.vue'),
      meta: {},
    }, {
      path: '/categories',
      name: 'categories', //商品分类
      component: () => import('@/components/goods/categories.vue'),
      meta: {},
    }, {
      path: '/orders',
      name: 'orders', //订单列表
      component: () => import('@/components/order/index.vue'),
      meta: {},
    }, {
      path: '/reports',
      name: 'reports', //数据报表
      component: () => import('@/components/reports/index.vue'),
      meta: {},
    }, ]


  }]
})