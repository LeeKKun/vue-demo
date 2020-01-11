<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left">
      <el-tab-pane label="基本信息" name="one">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>

          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>

          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <el-cascader v-model="form.goods_cat" :options="options" :props="porp"></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="two">
        <el-upload
          :action="action"
          list-type="picture-card"
          name="file"
          :headers="headers"
          multiple
          :on-success="handleSucces"
          :before-upload="handleBefore"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-button class="butxia" type="primary" @click="next">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane label="商品内容" name="three">
        <quill-editor v-model="form.goods_introduce"></quill-editor>
        <el-button type="primary" class="addbtn">添加</el-button>

      </el-tab-pane>

    </el-tabs>

    <!-- 图片预览模态框 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <img width="100%" :src="imgUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    action() {
      return `${this.$axios.defaults.baseURL}upload`;
    },
  },
  data() {
    return {
      active: 0,
      options: [],
      form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
      },
      porp: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
      },
      activeName: 'one',
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      dialogVisible: false,
      imgUrl: '',
    };
  },
  async created() {
    const { meta, data } = await this.$axios.get('categories?type=3');
    // console.log(meta, data);
    if (meta.status === 200) {
      this.options = data;
      console.log(this.options);
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab)
      // 需要的是数字
      this.active = +tab.index;
    },
    next() {
      const arr = ['one', 'two', 'three'];
      this.active++;
      this.activeName = arr[this.active];
    },
    handleSucces(response, file, fileList) {
      const { meta, data } = response;
      console.log(response);
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path,
        });
      }
      console.log(this.form.pics);
    },
    handleBefore(file) {
      const isGif = file.type === 'image/jpeg';
      const isLimit = file.size / 1024 / 1024 < 1;
      if (!isGif) {
        this.$message.error('只能上传jpg图');
      }
      if (!isLimit) {
        this.$message.error('上传图片必须小于1MB');
      }
      return isGif && isLimit;
    },
    handleRemove(file, fileList) {
      const path = file.response.data.tmp_path;
      // 把pics中对应path的那个对象给删除
      this.form.pics = this.form.pics.filter(item => item.pic !== path);
      console.log(this.form.pics);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.imgUrl = file.url;
    },
  },
};
</script>

<style lang="less" scoped>
.butxia {
  margin-top: 30px;
}

.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}

.el-tabs{
  margin-top: 40px
}

.addbtn{
margin-top: 20px
}
</style>
