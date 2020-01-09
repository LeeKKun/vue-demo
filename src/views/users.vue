/* eslint-disable no-template-curly-in-string */
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="width: 100%;margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="inputvalue" class="input-with-select">
      <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
    </el-input>
    <el-button @click="showadd" type="success">添加用户</el-button>

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
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button size="mini" @click="eiditform(row)"
          plain type="primary" icon="el-icon-edit"></el-button>
          <el-button
            @click="userdel(row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
          ></el-button>
          <el-button @click="showassignform(row)" size="mini"
          plain type="success" icon="el-icon-check">分配角色</el-button>
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

    <!-- 添加对话框 -->
    <el-dialog @close="closeDialog" title="添加用户" :visible.sync="dialogVisible" width="30%">
      <!-- 内容部分 -->
      <span>
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog  title="修改用户" :visible.sync="editVisible" width="30%">
      <!-- 内容部分 -->
      <span>
        <el-form :rules="rules" ref="editform" :model="editform" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-tag type="info">{{editform.username}}</el-tag>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editform.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editform.mobile" placeholder="请输入手机"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"  @click="addeditform">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog  title="分配角色"
    :visible.sync="assignformVisible"
    width="30%">
      <!-- 内容部分 -->
        <el-form  :model="assignform" label-width="80px">
          <el-form-item label="用户名">
            <el-tag type="info">{{assignform.username}}</el-tag>
          </el-form-item>

          <el-form-item label="角色列表">
               <el-select v-model="assignform.rid" placeholder="请选择">
              <el-option
              :value="item.id"
              :label="item.roleName"
              v-for="item in options"
              :key="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary"  @click="assform">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
      dialogVisible: false,
      editVisible: false,
      assignformVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: '',
      },
      assignform: {
        username: '',
        id: '', // 用户id
        rid: '', // 角色id
      },
      rules: {
        // required: true 为必填项
        // message 提示消息
        // trigger: blur 失去焦点触发校验   change 修改时就触发
        // min: 最小长度,  max: 最大长度
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '用户名长度必须是3-12位',
            trigger: ['change', 'blur'],
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码长度必须是6-12位',
            trigger: ['change', 'blur'],
          },
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['change', 'blur'],
          },
        ],
        mobile: [
          {
            pattern: /^1[1-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['change', 'blur'],
          },
        ],
      },
      options: [],
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
    // 用户状态
    async changegai(id, type) {
      console.log(id, type);
      // eslint-disable-next-line no-template-curly-in-string
      const { meta } = await this.$axios.put(`users/${id}/state/${type}`);
      console.log(meta);
      if (meta.status === 200) {
        this.$message.success(meta.msg);
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除对话框
    async userdel(id) {
      console.log(id);
      try {
        await this.$confirm('确认删除', '温习提示', {
          type: 'warning',
        });
        const { meta } = await this.$axios.delete(`users/${id}`);
        console.log(meta);
        if (meta.status === 200) {
          this.$message.success(meta.msg);
          if (this.userlist.length === 1 && this.pagenum > 1) {
            this.pagenum--;
          }
          this.getajax();
        } else {
          console.log(999);
          this.$message.error(meta.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 打开添加对话框
    showadd() {
      this.dialogVisible = true;
    },
    // 提交添加对话框
    async adduser() {
      try {
        await this.$refs.form.validate();
        const { meta } = await this.$axios.post('users', this.form);
        if (meta.status === 201) {
          this.$message.success(meta.msg);
          // 关闭对话框
          this.dialogVisible = false;
          // 重新渲染最后一页
          this.total++;
          this.pagenum = Math.ceil(this.total / this.pagesize);
          // 重新渲染页面;
          this.getajax();

          // 调用重置方法, 重置form表单的内容
          // this.$refs.form.resetFields();
        } else {
          this.message.error(meta.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 只要对话框关闭就触发
    closeDialog() {
      this.$refs.form.resetFields();
    },
    // 打开修改对话框
    eiditform(row) {
      console.log(row);
      this.editVisible = true;
      // this.editform.id = row.id;
      console.log(row.id);
      this.editform.id = row.id;
      this.editform.username = row.username;
      this.editform.email = row.email;
      this.editform.mobile = row.mobile;
    },
    // 提交修改对话框
    async addeditform() {
      try {
        // 进行校验
        await this.$refs.editform.validate();
        const { id, email, mobile } = this.editform;
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile });
        console.log(meta);
        if (meta.status === 200) {
          this.$message.success(meta.msg);
          this.editVisible = false;
          this.getajax();
        } else {
          this.$message.error(meta.msg);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 打开分配对话框
    async showassignform(row) {
      this.assignformVisible = true;
      this.assignform.id = row.id;
      this.assignform.username = row.username;
      this.assignform.rid = row.rid;
      // rid 也要回显, 回显用户原来的角色
      // this.assignForm.rid = row.rid
      // 根据用户id, 发送ajax, 获取对应的 rid (角色id)
      const assuser = await this.$axios.get(`users/${row.id}`);
      console.log(assuser);
      if (assuser.meta.status === 200) {
        // 如果是新添加的用户, rid默认值是-1, 但是应该给一个"", 显示成请选择
        const { rid } = assuser.data;
        this.assignform.rid = rid === -1 ? '' : rid;
        console.log(this.assignform.rid);
      }
      // 发送ajax请求, 获取到可供选择的角色列表
      const { data, meta } = await this.$axios.get('roles');
      if (meta.status === 200) {
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 提交分配对话框
    async assform() {
      console.log(888);
      const { id, rid } = this.assignform;
      if (rid === '') {
        this.$message.error('请选择角色');
        return;
      }
      // 分配的ajax请求
      const { meta } = await this.$axios.put(`users/${id}/role`, { rid });
      console.log(meta);
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        // 关闭对话框
        this.assignformVisible = false;
        // 重新渲染页面
        this.getajax();
      } else {
        this.$message.error(meta.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
  margin-right: 30px;
}
</style>
