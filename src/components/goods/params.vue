<template>
  <div>
    <nav-crumbs>
      <template #level1>商品管理</template>
      <template #level2>分类参数</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-form>
        <el-alert
          title="注意：只允许为第三级分类设置相关参数!"
          type="warning"
          show-icon
        >
        </el-alert>
        <el-form-item label="商品分类" style="margin-top:20px">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="defaultPorp"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="1">
            <el-button type="primary" size="mini">添加参数</el-button>
            <el-table :data="arrDyparams" style="width: 100%">
              <el-table-column type="expand" label="#">
                <template slot-scope="scope">
                  <el-tag
                    :key="tag"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope.row, tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column prop="attr_name" label="属性名称">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="2">
            <el-button type="primary" size="mini">添加属性</el-button>
            <el-table :data="arrAttr" style="width: 100%">
              <el-table-column label="#"> </el-table-column>
              <el-table-column prop="attr_name" label="属性名称">
              </el-table-column>
              <el-table-column prop="attr_vals" label="属性值">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "name",
  data() {
    return {
      //级联选择器配置
      defaultPorp: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //级联选择器选择的数据
      selectedOptions: [],
      //渲染级联选择器
      options: [],
      //商品参数
      arrDyparams: [],
      // 商品属性
      arrAttr: [],
      active: "1",
      inputVisible: false,
      inputValue: "",
      dynamicTags: ["标签一", "标签二", "标签三"],
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //获取三级分类的信息
    getGoodCate() {
      this.$api.getGoodList().then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.options = data;
        } else {
          this.$message.error(msg);
        }
      });
    },
    //获取参数
    getParams() {
      this.$api
        .getGoodParams(this.selectedOptions[this.selectedOptions.length - 1])
        .then((res) => {
          const {
            data,
            meta: { msg, status },
          } = res.data;
          if (status == 200) {
            this.arrDyparams = data;
            //过滤数组
            // this.arrDyparams = this.arrDyparams.filter(
            //   (item) => item.attr_vals
            // );
            //遍历数组
            this.arrDyparams.forEach((item) => {
              if (item.attr_vals != "") {
                item.attr_vals = item.attr_vals.trim().split(" ");
              }
            });
          } else {
            this.$message.error(msg);
          }
        });
    },
    //获取属性
    getAttr() {
      this.$api
        .getGoodAttr(this.selectedOptions[this.selectedOptions.length - 1])
        .then((res) => {
          const {
            data,
            meta: { msg, status },
          } = res.data;
          if (status == 200) {
            this.arrAttr = data;
          } else {
            this.$message.error(msg);
          }
        });
    },
    // 级联选择器改变时触发
    handleChange() {
      if (this.selectedOptions.length == 3) {
        //获取动态参数
        this.getParams();
      }
    },
    //切换导航
    handleClick() {
      if (this.active == "2") {
        if (this.selectedOptions.length == 3) {
          //获取静态参数
          this.getAttr();
        }
      }
    },
    //关闭tag按钮
    handleClose(info, tag) {
      // 删除参数
      console.log(info);
      info.attr_vals.splice(info.attr_vals.indexOf(tag), 1);
      var attr_vals = info.attr_vals.join(" ");
      this.saveParams(info, attr_vals, "many");
    },
    //保存params
    saveParams(info, attr_vals, type) {
      var putData = {
        id: { cat_id: this.selectedOptions[2], attr_id: info.attr_id },
        data: {
          attr_name: info.attr_name,
          attr_sel: type,
          attr_vals,
        },
      };
      this.$api.updateParams(putData).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          console.log("修改成功");
        } else {
          this.$message.error(msg);
        }
      });
    },
    //显示添加tag输入框
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //输入框失去焦点
    handleInputConfirm(info) {
      let inputValue = this.inputValue;
      if (inputValue) {
        if (info.attr_vals == "") {
          info.attr_vals = [];
        }
        info.attr_vals.push(inputValue);
        var attr_vals = info.attr_vals.join(" ");
        this.saveParams(info, attr_vals, "many");
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  components: {},
};
</script>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
