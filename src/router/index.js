import Vue from 'vue';
import VueRouter from 'vue-router';
// 导入单文件, 就可以得到需要的组件对象了
import login from '../views/login.vue';
import Register from '../views/Register.vue';
import index from '../views/index.vue';

import users from '../views/users/users.vue';
import rights from '../views/rights/rights.vue';
import roles from '../views/rights/roles.vue';
import home from '../views/home/home.vue';
import categories from '../views/products/categories.vue';
import goods from '../views/products/goods.vue';
import goodadd from '../views/products/goodsadd.vue';

// 基于vue的插件, 需要Vue.use一下, 才能使用, 不然会报错
Vue.use(VueRouter);


// 创建路由实例
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      component: index,
      children: [
        { path: '', component: home },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: categories },
        { path: '/goods', component: goods },
        { path: '/goods-add', component: goodadd },
      ],
    },
    { path: '/login', component: login },
    { path: '/register', component: Register },
  ],
});

// 配置全局前置守卫
// 将所有的路由被访问时，都会经过前置守卫，只有通过前置守卫，才能看到对应内容
// to 到哪去
// from 到哪去
// next() 放行，next(路径) 拦截到对应的路由
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (token || to.path === '/login') {
    next();
  } else {
    next('/login');
  }
});

// 默认导出
export default router;
