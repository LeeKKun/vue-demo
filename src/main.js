import Vue from 'vue';
import elementui from 'element-ui';
import App from './App.vue';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';

// 导入bess文件
import './styles/bess.less';

Vue.config.productionTip = false;

Vue.use(elementui);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
