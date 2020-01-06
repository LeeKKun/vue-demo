<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎~
        <a href="javascript:void(0);" @click="logout">退出</a>
      </div>
    </el-header>

    <!-- 侧边栏 -->
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu v-for="menu in menulist" :key="menu.id" :index="menu.path">
            <!-- 设置标题 具名插槽 -->
            <template v-slot:title>
              <i class="el-icon-s-custom"></i>
              <span>{{ menu.authName }}</span>
            </template>

            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
              <i class="el-icon-menu"></i>
              {{ item.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  computed: {
    defaultActive() {
      // this.$route 获取地址栏相关的参数信息
      // this.$router 整个的大的路由实例, 一个应用一般就一个
      // console.log(this.$route)
      return this.$route.path.slice(1);
    },
  },
  data() {
    return {
      menulist: [],
    };
  },
  created() {
    // 发送ajax请求
    this.$axios
      .get('menus').then((res) => {
        // console.log(res.data);
        const { data, meta } = res;
        if (meta.status === 200) {
          this.menulist = data;
          // console.log(this.menulist);
        } else {
          this.$message.error(meta.msg);
        }
      });
  },
  methods: {
    logout() {
      this.$confirm('你确认退出嘛', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      })
        .then(() => {
          // 退出成功的提示
          this.$message({
            showClose: true, // 配置手动关闭消息框
            message: '退出成功', // 配置内容为成功后的msg
            type: 'success',
          });
          // 清除本地的 token 信息
          localStorage.removeItem('token');
          // 跳转到登录页 (跳转路由)
          this.$router.push('/login');
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang='less' scoped>
/* 默认情况下，不同组件的样式会影响 */
/* 解决方案 : 1.使用模本的类名嵌套
              2.给style加上 scoped 属性
                  原理，给当前组件全部加上了data-v-xxxx
*/
.index {
  height: 100%;
  .el-header {
    display: flex;
    background-color: #d8d8d8;

    .logo {
      width: 180px;
      img {
        height: 40px;
        margin: 10px;
      }
    }
    .title {
      flex: 1;
      text-align: center;
      line-height: 60px;
    }
    .logout {
      width: 180px;
      font-size: 24px;
      text-align: right;
      line-height: 60px;
      font-weight: 700;
      a {
        color: red;
        font-size: 20px;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #fff;
  }
}
</style>
