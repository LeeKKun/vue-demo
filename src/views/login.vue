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
// 导入ajax
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
      // 先进行校验，校验通过发送ajax请求
      this.$refs.form.validate((isdl) => {
        // isdl 是否通过校验, true, 通过, false未通过
        // 如果未通过校验, 直接return
        if (!isdl) return;
        // 验证通过，发送ajax请求
        axios.post('login', this.form).then((res) => {
          // console.log(res);
          const { meta, data } = res;
          // 弹出登录成功消息框
          if (meta.status === 200) {
            this.$message({
              showClose: true, // 配置手动关闭消息框
              message: meta.msg, // 配置内容为成功后的msg
              type: 'success',
            });

            // 发送请求时，将token存起来
            localStorage.setItem('token', data.token);

            // 登录成功跳转到首页
            this.$router.push('/index');
          } else {
            // console.log('登录失败');
            // 弹出登录失败消息框
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
      // 调用from组件的重置方法，进行重置
      this.$refs.form.resetFields();
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
