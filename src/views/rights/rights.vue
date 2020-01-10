<template>
  <div>
       <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 表格 -->
    <el-table :data="rightlist">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="限权名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template v-slot:default="{ row }">
          <p v-if="row.level === '0'">一级</p>
          <p v-if="row.level === '1'">二级</p>
          <p v-if="row.level === '2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightlist: [],
    };
  },
  async created() {
    const { meta, data } = await this.$axios.get('rights/list');
    console.log(meta, data);
    if (meta.status === 200) {
      this.rightlist = data;
    } else {
      this.$message.error(meta.msg);
    }
  },

};
</script>

<style>

</style>
