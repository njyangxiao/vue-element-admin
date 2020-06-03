<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="23">
          <div class="logo-wrap">
            <img class="logo" src="../../assets/logo.png" alt="无法显示图片" />
            <span>后台管理系统</span>
          </div>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="loginout" @click="$loginOut"
            >退出</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <navMenu :menuList="menuList" />
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navMenu from "@/components/navMenu";
export default {
  name: "home",
  data() {
    return {
      menuList: [],
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      this.$api.getMenus().then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.menuList = data;
        }
      });
    },
  },
  components: {
    navMenu,
  },
};
</script>

<style lang="sass" scoped>
@import "./index.scss";
</style>
