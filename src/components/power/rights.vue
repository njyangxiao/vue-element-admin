<template>
  <div>
    <nav-crumbs>
      <template #level1>权限管理</template>
      <template #level2>权限列表</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-table
        height="500px"
        :data="list"
        class="table"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column label="层级">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getRightsList();
  },
  methods: {
    getRightsList() {
      this.$api.rights({ type: "list" }).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.list = data;
        } else {
          this.$message.error(msg);
        }
      });
    },
  },
};
</script>
