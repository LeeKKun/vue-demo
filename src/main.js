import Vue from 'vue';
import ElementUI from 'element-ui'; // 基于vue的插件，需要use以下
import App from './App.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';

// 导入bess文件
import './styles/bess.less';

Vue.config.productionTip = false;

// 只要是基于vue的插件，一律需要vue.use一下才可以用
Vue.use(ElementUI);

new Vue({
  router,
  // 使用App组件, 调用底层的render方法, 渲染视图
  render: h => h(App),
}).$mount('#app');
