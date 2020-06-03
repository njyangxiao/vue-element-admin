<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
    <el-breadcrumb-item><slot name="level1"></slot></el-breadcrumb-item>
    <el-breadcrumb-item><slot name="level2"></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "navCrumbs",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
