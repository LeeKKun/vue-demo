<template>
  <div>
  <!-- 添加按钮 -->
  <el-button @click="goadd" type="success" plain="" class="addbtn">添加按钮</el-button>

  <!-- 表格 -->
  <el-table :data="goodslist">
    <el-table-column type="index" :index="indexMethod" label="#"></el-table-column>
    <el-table-column label="商品名称" prop="goods_name"></el-table-column>
    <el-table-column label="商品价格" prop="goods_price"></el-table-column>
    <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
    <el-table-column label="创建时间" prop="upd_time">
      <template v-slot="{ row }">
        {{ row.add_time | time }}
      </template>
    </el-table-column>
    <el-table-column label="操作" prop="">
      <el-button type="primary" plain="" icon="el-icon-edit" size="small">
      </el-button>

      <el-button type="danger" plain="" icon="el-icon-delete" size="small">
      </el-button>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
    <el-pagination
       background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodslist: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
    };
  },
  created() {
    this.goodlist();
  },
  methods: {
    async goodlist() {
      const { meta, data } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      console.log(meta, data);
      if (meta.status === 200) {
        this.goodslist = data.goods;
        this.total = data.total;
        console.log(this.goodslist);
      }
    },
    goadd() {
      this.$router.push('/goods-add');
    },
    indexMethod(index) {
      return (this.pagenum - 1) * this.pagesize + index + 1;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.goodlist();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.goodlist();
    },
  },
};
</script>

<style lang="less" scoped>
.addbtn {
  margin-bottom: 10px;
}

</style>
