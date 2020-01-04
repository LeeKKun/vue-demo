<template>
  <div>
      这是users租金
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
    };
  },
  created() {
    axios.get('http://localhost:8888/api/private/v1/users', {
      // get请求的参数, 将来会被拼接到地址栏中
      params: {
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      },
      // 请求, 如果要拿到结果, 必须带上token令牌
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }).then((res) => {
      console.log(res.data);
    });
  },

};
</script>

<style>

</style>
