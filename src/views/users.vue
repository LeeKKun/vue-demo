/* eslint-disable no-template-curly-in-string */
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="width: 100%;margin-bottom: 20px">
      <el-breadcrumb-item  :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item >用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容"  v-model="inputvalue" class="input-with-select">
    <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
    </el-input>
    <el-button  type="success" > 添加用户</el-button>


    <el-table :data="userlist" border style="width: 100%;margin-bottom: 20px">
      <el-table-column label="姓名" prop="username" width="100"></el-table-column>

      <el-table-column label="邮箱" prop="email" width="150"></el-table-column>

      <el-table-column label="电话" prop="mobile"></el-table-column>

      <el-table-column label="用户状态" prop>
        <!-- 匿名插槽 -->
        <template v-slot:default="obj">
          <el-switch
          @change="changegai(obj.row.id, obj.row.mg_state)"
          v-model="obj.row.mg_state"
           active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template>
          <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputvalue: '', // 输入框的值
      query: '', // 搜索条件
      pagenum: 1, // 当前页
      pagesize: 2, // 每页条数
      userlist: [], // 用户列表
      total: 0, // 总条数
    };
  },
  created() {
    // 渲染页面, 需要数据的, 一进入页面, 发送ajax请求, 获取对应的数据
    this.getajax();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getajax();
    },
    // 当前页触发
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getajax();
    },
    getajax() {
      this.$axios
        .get('users', {
          // get请求的参数, 将来会被拼接到地址栏中
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
          // 请求, 如果要拿到结果, 必须带上token令牌
        })
        .then((res) => {
          // console.log(res);
          const { data, meta } = res;
          if (meta.status === 200) {
            this.userlist = data.users;
            this.total = data.total;
            // console.log(this.userlist);
            // console.log(this.total);
          }
        });
    },
    search() {
      this.pagenum = 1;
      this.query = this.inputvalue;
      this.getajax();
      this.inputvalue = '';
    },
    changegai(id, type) {
      console.log(id, type);
      // eslint-disable-next-line no-template-curly-in-string
      this.$axios.put('users/${id}/state/${type}', {
      }).then(

      );
    },
  },
};
</script>

<style lang="less" scoped>
.input-with-select {
    width: 300px;
    margin-bottom: 10px;
    margin-right: 30px
  }
</style>
