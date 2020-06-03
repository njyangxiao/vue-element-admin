<template>
  <el-col :span="12" class="menu">
    <el-menu
      unique-opened
      :router="true"
      default-active="0"
      text-color="#fff"
      background-color="#333744"
      active-text-color="#409EFF"
    >
      <el-submenu :index="item1.order" v-for="item1 in menuList" :key="item1">
        <template slot="title">
          <i :class="iconList[item1.id]"></i>
          <span>{{ item1.authName }}</span>
        </template>
        <el-menu-item
          :index="'/' + item2.path"
          v-for="item2 in item1.children"
          :key="item2"
        >
          <i class="el-icon-menu"></i>
          <span>{{ item2.authName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</template>
<script>
export default {
  data() {
    return {
      iconList: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-flag",
        "101": "el-icon-s-shop",
        "102": "el-icon-s-order",
        "145": "el-icon-s-marketing",
      },
    };
  },
  methods: {},
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
  height: 100%;
  .el-menu {
    border: none;
  }
}
</style>
