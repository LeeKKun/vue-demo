/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import ElementUI from 'element-ui'; // 基于vue的插件，需要use以下
import moment from 'moment'; // 基于vue的插件，需要use以下
import VueQuillEditor from 'vue-quill-editor';

import axios from 'axios';
import App from './App.vue';
import router from './router';
import 'element-ui/lib/theme-chalk/index.css';

// 导入bess文件
import './styles/bess.less';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

// 只要是基于vue的插件，一律需要vue.use一下才可以用
Vue.use(ElementUI);
Vue.use(moment);
Vue.use(VueQuillEditor);


Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

// 配置基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';


// 配置请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // console.log(config);
  config.headers.Authorization = localStorage.getItem('token');
  return config;
}, error => Promise.reject(error));

// 响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做点什么
  response = response.data;
  // 校验结果, 如果响应时, 发现状态码是401, 说明是无效token, 拦截到登录
  if (response.meta.status === 401) {
    localStorage.removeItem('token');
    response.meta.msg = '登录状态已失效, 请重新登录';
    router.push('/login');
  }
  return response;
}, error => Promise.reject(error));


// 定义全局的过滤器
Vue.filter('time', value => moment(value * 1000).format('YYYY-MM-DD HH:mm:ss'));


new Vue({
  router,
  // 使用App组件, 调用底层的render方法, 渲染视图
  render: h => h(App),
}).$mount('#app');
