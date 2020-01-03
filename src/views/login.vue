<template>
  <div class="login">
    <el-form :rules="rules" status-icon ref="form" :model="form" label-width="80px">
      <img class="logimg" src='../assets/avatar.jpg' alt="">
      <el-form-item label="账号"  prop="username" >
        <el-input @keyup.enter.native='login' placeholder="请输入用户名"
        v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop='password'>
        <el-input @keyup.enter.native='login'
         placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="loginbtn" type="primary" @click="login">登录</el-button>
        <el-button @click="reset" >重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        // required: true 为必填项
        // message 提示消息
        // trigger: blur 失去焦点触发校验   change 修改时就触发
        // min: 最小长度,  max: 最大长度
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3, max: 12, message: '用户名长度必须是3-12位', trigger: ['change', 'blur'],
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3, max: 12, message: '密码长度必须是3-12位', trigger: ['change', 'blur'],
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.form.validate((isdl) => {
        if (!isdl) return;
        // console.log('发送请求');
        axios.post('http://localhost:8888/api/private/v1/login', this.form).then((res) => {
          // console.log(res);
          const { meta } = res.data;
          if (meta.status === 200) {
            // console.log('登录成功');
            this.$message({
              showClose: true,
              message: meta.msg,
              type: 'success',
            });
            // 登录成功跳转到首页
            this.$router.push('/index');
          } else {
            // console.log('登录失败');
            this.$message({
              showClose: true,
              message: meta.msg,
              type: 'error',
            });
          }
        });
      });
    },
    reset() {
      this.$refs.form.resetFields();
      // console.log(4444);
    },
  },
};
</script>

<style lang="less">
.login{
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form{
    width: 400px;
    padding: 90px 20px 20px 20px;
    background-color: #fff;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 200px;
    position: relative;
  }
  .loginbtn{
    margin-right: 70px;
  }
  .logimg{
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    border-radius: 50%;
    border: 5px solid #fff;
    top: -60px
  }
}
</style>
