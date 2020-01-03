import Vue from 'vue';
import App from './App.vue';
import router from './router';
import styles from './styles/bess.less';

Vue.config.productionTip = false;


new Vue({
  render: h => h(App),
  router,
  styles,
}).$mount('#app');
