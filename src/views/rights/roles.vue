<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="width: 100%;margin-bottom: 20px">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button plain type="success" class="addbtn">添加用户</el-button>

    <!-- 角色列表 -->
    <el-table :data="rolelist">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <!-- <el-tag v-for="item in row.children" :key="item.id">
            {{ item.authName }}
          </el-tag>-->
          <!-- 一级权限 -->
          <p :v-if="row.children.length === 0"> 暂无权限 </p>
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag  @close="delright(row, l1.id)" closable>
                {{ l1.authName }}
                </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row class="l2"
               v-for="l2 in l1.children"
               :key="l2.id">
                <el-col :span="4">
                  <el-tag
                   @close="delright(row, l2.id)"
                   closable type="success">
                   {{ l2.authName }}
                   </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <!-- 三级权限 -->
                  <el-tag @close="delright(row, l3.id)" class="l3"
                  closable v-for="l3 in l2.children" :key="l3.id" type="info">
                    {{ l3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>

          <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>

          <el-button @click="showass(row)"
          size="mini" plain type="success" icon="el-icon-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      >

      <el-tree
      node-key="id"
      ref="tree"
      :data="data"
       :props="defaultProps"
       show-checkbox
       default-expand-all
       >
       </el-tree>

      <template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="addass" type="primary" >分配</el-button>
      </span>
      </template>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleid: '', // 标记正在分配的角色id
      rolelist: [],
      dialogVisible: false,
      data: [],
      defaultProps: { // 配置树形结构展示的属性
        children: 'children', // 配置展开的子集
        label: 'authName', // 配置展开的文字
      },
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    // 查询角色列表
    async getlist() {
      const { meta, data } = await this.$axios.get('roles');
      console.log(meta, data);
      if (meta.status === 200) {
        this.rolelist = data;
      } else {
        console.log(888);
      }
    },
    // 删除权限
    async delright(row, rightid) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightid}`);
      console.log(meta, data);
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        // this.getlist();
        // 重新渲染, 发送ajax请求, 获取整个的roleList, 并且整个roleList都重新渲染
        // 其实只需要 重新渲染, 正在操作的这个角色的剩余权限即可
        row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 显示分配对话框
    async showass(row) {
      this.roleid = row.id;
      this.dialogVisible = true;
      const { meta, data } = await this.$axios.get('rights/tree');
      console.log(meta, data);
      if (meta.status === 200) {
        this.data = data;
        console.log(this.data);
        const ids = [];
        row.children.forEach((l1) => {
          l1.children.forEach((l2) => {
            l2.children.forEach((l3) => {
              ids.push(l3.id);
            });
          });
        });

        this.$refs.tree.setCheckedKeys(ids);
      } else {
        this.message.error(meta.msg);
      }
    },
    // 分配限权
    async addass() {
      console.log(888);
      const ids = this.$refs.tree.getCheckedKeys(); // 获取全选
      const halfs = this.$refs.tree.getHalfCheckedKeys(); // 获取半选的;
      const rids = [...ids, ...halfs].join(','); // 全选和半选的
      const { meta } = await this.$axios.post(`roles/${this.roleid}/rights`, { rids });
      console.log(meta);
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.dialogVisible = false;
        this.getlist();
      } else {
        this.$message.error(meta.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.addbtn {
  margin-bottom: 10px;
}
.l1{
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.l2{
  margin-bottom: 20px;
}
.l3{
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
