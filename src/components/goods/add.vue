<template>
  <div>
    <nav-crumbs>
      <template #level1>商品管理</template>
      <template #level2>添加商品</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="success" center show-icon>
      </el-alert>
      <el-steps
        class="steps"
        :active="active - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <el-form
        label-position="top"
        label-width="80px"
        :model="addShopForm"
        style="height:400px;overflow:auto"
      >
        <el-tabs
          class="tab"
          :before-leave="beforeTabLeave"
          v-model="active"
          tab-position="left"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="addShopForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="addShopForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="addShopForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="addShopForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="selectedOptions"
                :options="options"
                :props="defaultPorp"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <!-- 显示该三级分类的商品参数 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in arrDyparams"
              :key="item"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item2"
                  border
                  v-for="item2 in item.attr_vals"
                  :key="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in arrAttr"
              :key="item"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-form-item>
              <el-upload
                :action="action"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="fileList"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <el-form-item>
              <quill-editor
                v-model="addShopForm.goods_introduce"
              ></quill-editor>
              <el-button type="primary" class="btnAdd" @click="addGoods"
                >添加商品</el-button
              >
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import navCrumbs from "@/components/navCrumbs";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "name",
  data() {
    return {
      active: "0",
      //添加商品的数据
      addShopForm: {
        //商品名称
        goods_name: "",
        // 分类列表
        goods_cat: "",
        // 价格
        goods_price: "",
        // 数量
        goods_number: "",
        // 重量
        goods_weight: "",
        // 商品参数
        attrs: "",
        //商品内容
        goods_introduce: "",
        //商品图片
        pics: "",
      },
      //级联选择器绑定的数据
      options: [],
      //联级选择器 绑定的数据
      selectedOptions: [],
      //级联选择器配置
      defaultPorp: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //商品参数
      arrDyparams: [],
      // 商品属性
      arrAttr: [],
      //图片上传请求路径
      action: "https://jsonplaceholder.typicode.com/posts/",
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    //添加商品
    addGoods() {
      var arr1 = this.arrDyparams.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      var arr2 = this.arrAttr.map((item) => {
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      this.addShopForm.attrs = [...arr1, ...arr2];

      this.$api.goods(this.addShopForm).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;

        console.log(res);

        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 点击tab 触发
    beforeTabLeave(newNum, oldNum) {
      if (newNum == 1 || newNum == 2) {
        if (this.selectedOptions != "") {
          if (newNum == 1) {
            this.getParams();
          } else if (newNum == 2) {
            this.getAttr();
          }
        } else {
          this.$message.warning("请先选择商品的三级分类");
          return false;
        }
      }
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
    // 获取属性
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
    //级联选择器触发的方法
    handleChange() {
      this.addShopForm.goods_cat = this.selectedOptions.join(",");
    },
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
    //上传图片触发
    handlePreview(file) {
      console.log("上传");
    },
    //移除图片触发
    handleRemove(file) {
      console.log("移除");
    },
    //图片上传成功触发
    handleSuccess(file) {
      console.log("成功");
    },
  },
  components: {
    navCrumbs,
    quillEditor,
  },
};
</script>

<style lang="scss">
.steps,
.tab {
  margin-top: 20px;
}
.btnAdd {
  margin-top: 20px;
}
.ql-editor {
  min-height: 300px;
}
</style>
