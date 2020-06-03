<template>
  <div>
    <nav-crumbs>
      <template #level1>商品管理</template>
      <template #level2>商品分类</template>
    </nav-crumbs>
    <el-card class="box-card ">
      <el-button type="primary" @click="dialogAddTypes = true"
        >添加分类</el-button
      >
      <!-- 列表 -->
      <el-table class="table" :data="cateList" style="width: 120%" border>
        <tree-table
          prop="cat_name"
          label="分类名称"
          treeKey="cat_id"
          parentKey="cat_pid"
          levelKey="cat_level"
          childKey="children"
        >
        </tree-table>
        <el-table-column label="级别">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="mini"
              type="success"
              v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <i
              class="el-icon-success"
              style="color: lightgreen"
              v-if="scope.row.cat_deleted === false"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal"
      ></el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="dialogAddTypes">
        <el-form :model="addForm">
          <el-form-item label="分类名称" label-width="120px">
            <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="120px">
            <el-cascader
              :options="options"
              v-model="seletedOptions"
              :props="cascaderProps"
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hasAddDialog(false)">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "name",
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      pageTotal: 0,
      // 列表数据
      cateList: [],
      //添加分类的数据
      addForm: {
        cat_name: "",
      },
      //添加分类弹窗
      dialogAddTypes: false,
      //联级选择器数据
      options: [],
      //联级选择器选择的数据
      seletedOptions: [],
      //级联选择器配置项
      cascaderProps: {
        // 配置触发选项 hover/click
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
    };
  },
  created() {
    this.getGoodList();
    this.getParentCateList();
  },
  methods: {
    //添加分类弹窗是否显示
    hasAddDialog(flag) {
      this.addForm = {};
      this.dialogAddTypes = flag;
    },
    //提交添加分类
    submitAdd() {
      this.hasAddDialog(false);
    },
    //获取列表
    getGoodList() {
      var data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
      };
      this.$api.getGoodListByPag(data).then((res) => {
        console.log(res);
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.cateList = data.result;
          this.pageTotal = data.total;
        }
      });
    },
    //获取父级分类(三级联动)
    getParentCateList() {
      this.$api.getGoodListParent({ type: 2 }).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.options = data;
        }
      });
    },
    // 监听 pageSizeChange
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getGoodList();
    },
    // 监听 pagenum改变
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getGoodList();
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 20px;
}
</style>
