<template>
  <div>
    <!-- 按钮 -->
    <el-button @click="showadddialog"  plain type="success" class="addbtn">添加分类</el-button>

    <!-- 表格 -->
    <el-table
    v-loading="islading"
    element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.9)"
    row-key="cat_id"
    :data="categoryList"
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>

      <el-table-column label="是否有效">
        <template v-slot:default="{ row }">{{row.cat_deleted ? '否' : "是"}}</template>
      </el-table-column>

      <el-table-column label="层级" prop="cat_level"></el-table-column>

      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
     <el-pagination
     background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    <!-- 对话框 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="addVisible"
      width="40%"
      >
      <el-form :rules="rules" ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入父级名称"></el-input>
        </el-form-item>

        <el-form-item label="父级名称">
            <el-cascader
            ref="cascader"
            clearable
            v-model="form.cat_pid"
            :options="options"
            :props="props">
            </el-cascader>
        </el-form-item>
      </el-form>

      <template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button @click="addcat" type="primary" >确 定</el-button>
        </span>
    </template>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 5,
      categoryList: [],
      total: 0,
      islading: false,
      addVisible: false,
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: '',
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['change', 'blur'] },
        ],
      },
      options: [],
      props: {
        expandTrigger: 'hover', // 配置触发的方式, 为hover触发
        value: 'cat_id', // value是将来要提交给后台的id
        label: 'cat_name', // 配置显示的文字
        children: 'children', // 配置子集的展开属性名
        checkStrictly: true, // 可以选中任意一级
      },
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    async getlist() {
      this.islading = true;
      const { meta, data } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      console.log(meta, data);

      if (meta.status === 200) {
        this.categoryList = data.result;
        this.total = data.total;
      }
      this.islading = false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getlist();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getlist();
    },
    async showadddialog() {
      this.addVisible = true;
      const { data, meta } = await this.$axios.get('categories?type=2');
      console.log(data, meta);
      if (meta.status === 200) {
        this.options = data;
        console.log(this.options);
      } else {
        this.$message.success(meta.msg);
      }
    },
    async addcat() {
      try {
        await this.$refs.form.validate();
        const { meta } = this.$axios.post('categories', {
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1 || 0],
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_pid.length,
        });
        console.log(meta);
      } catch (e) {
        console.log(e);
      }
    },
  },
  watch: {
    'form.cat_pid'(newValue) {
      this.$refs.cascader.dropDownVisible = false;
    },
  },
};
</script>

<style lang='less' scoped>
.addbtn {
  margin-bottom: 10px;
}
</style>
