import Vue from 'vue';
import VueRouter from 'vue-router';

// 导入单文件, 就可以得到需要的组件对象了
import login from '../views/login.vue';
import Register from '../views/Register.vue';

// 基于vue的插件, 需要Vue.use一下, 才能使用, 不然会报错
Vue.use(VueRouter);


// 创建路由实例
const router = new VueRouter({
  routes: [
    { path: '/', component: login },
    { path: '/login', component: login },
    { path: '/register', component: Register },
  ],
});

// 默认导出
export default router;
