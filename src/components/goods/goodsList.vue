<template>
  <div>
    <nav-crumbs>
      <template #level1>商品管理</template>
      <template #level2>商品列表</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-row class="search-wrap">
        <el-col>
          <el-input
            placeholder="请输入内容"
            class="inputSearch"
            v-model="queryInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        class="table"
        :data="goodsList"
        border
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品数量">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatData }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delSubmit(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "name",
  data() {
    return {
      //获取商品列表传参
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表
      goodsList: [],
      // 商品总数
      total: "",
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //跳转添加商品
    goAddGoods() {
      this.$router.push({ name: "goodsAdd" });
    },
    // 获取商品列表
    getGoodsList() {
      this.$api.getGoods(this.queryInfo).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.goodsList = data.goods;
          this.total = data.total;
        } else {
          this.$message.error(msg);
        }
      });
    },
    //删除列表
    delSubmit(data) {
      this.$confirm("此操作将永久删除该选项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.delGoods(data).then((res) => {
            const {
              data,
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              this.$message.success(msg);
              this.getGoodsList();
            } else {
              this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    //搜索功能
    search() {
      this.getGoodsList();
    },
    //改变每页显示条数
    handleSizeChange(val) {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.inputSearch {
  width: 300px;
  margin-right: 10px;
}
.table {
  margin-top: 20px;
}
</style>
