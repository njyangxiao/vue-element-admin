<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item label="名称">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button class="login-btn" type="primary" @click="submit"
        >登录</el-button
      >
    </el-form>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      formdata: {
        username: "admin",
        password: "123456",
      },
    };
  },
  methods: {
    submit() {
      var username = this.formdata.username.trim();
      var password = this.formdata.password.trim();
      if (username == "") {
        this.$message.error("请输入用户名");
        return;
      }
      if (password == "") {
        this.$message.error("请输入密码");
        return;
      }
      this.$api
        .login(this.formdata)
        .then((res) => {
          const {
            data,
            meta: { msg, status },
          } = res.data;
          var ss = "";
          if (status === 200) {
            Cookies.set("token", data.token, {
              expires: 1,
            });
            setTimeout(() => {
              this.$router.push({ name: "home" });
            }, 300);
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="sass" scoped>
@import "./index.scss";
</style>
