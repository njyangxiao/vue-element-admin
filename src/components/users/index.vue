<template>
  <div>
    <nav-crumbs>
      <template #level1>用户管理</template>
      <template #level2>用户列表</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-row class="search-wrap">
        <el-col>
          <el-input
            placeholder="请输入内容"
            v-model="query"
            class="inputSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
          <el-button type="primary" @click="hasAddDialog(true)"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userList" class="table" v-loading="loading">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatData }}
          </template>
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="submitDelete(scope.row)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                size="mini"
                plain
                type="warning"
                icon="el-icon-s-tools"
                circle
                @click="showRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAdd">
      <el-form :model="addUserForm" :rules="addRules" ref="formAdd">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input
            v-model="addUserForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密  码" label-width="100px" prop="password">
          <el-input
            v-model="addUserForm.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" label-width="100px" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" label-width="100px" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hasAddDialog(false)">取 消</el-button>
        <el-button type="primary" @click="submitAdd('formAdd')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEdit">
      <el-form :model="editUserForm" :rules="editRules" ref="formEdit">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input
            v-model="editUserForm.username"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮  箱" label-width="100px" prop="email">
          <el-input v-model="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电  话" label-width="100px" prop="mobile">
          <el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hasEditDialog(false)">取 消</el-button>
        <el-button type="primary" @click="submitEdit('formEdit')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogRole">
      <el-form :model="roleUserForm">
        <el-form-item label="用户名" label-width="100px">
          {{ currentUsername }}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-select v-model="roleUserForm.rid" placeholder="请选择">
            <!-- <el-option label="请选择" :value="-1" disabled></el-option> -->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in rolesList"
              :key="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hasRoleDialog(false)">取 消</el-button>
        <el-button type="primary" @click="submitRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    const RegEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;

    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (value.length < 5) {
        return callback(new Error("密码不得小于5位"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!RegEmail.test(value)) {
        return callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        callback();
      }
    };
    return {
      userList: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      loading: true,
      total: "", //列表总数
      dialogAdd: false, //添加用户弹窗是否显示
      dialogEdit: false, //编辑用户弹窗是否显示
      dialogRole: false, //分配角色弹窗是否显示
      //添加用户的数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //编辑用户的数据
      editUserForm: {},
      //分配角色的数据
      roleUserForm: {},
      // 当前role用户名称
      currentUsername: {},
      //添加用户规则
      addRules: {
        username: [{ validator: checkUserName, trigger: "blur" }],
        password: [{ validator: checkPass, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      //编辑用户规则
      editRules: {
        username: [{ validator: checkUserName, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      //角色列表
      rolesList: [],
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    getUserList() {
      var query = this.query;
      var pagenum = this.pagenum;
      var pagesize = this.pagesize;
      var data = { query, pagenum, pagesize };
      this.loading = true;
      this.$api.getUsers(data).then((res) => {
        this.loading = false;
        const {
          data: { users, total },
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.total = total;
          this.userList = users;
          // formatData
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 条件查询
    search() {
      this.pagenum = 1;
      this.getUserList();
    },
    //改变状态
    changeState(e) {
      this.$api.changeUserStatus(e).then((res) => {
        const {
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 设置每页条数
    handleSizeChange(e) {
      this.pagesize = e;
      this.pagenum = 1;
      this.getUserList();
    },
    // 改变页数
    handleCurrentChange(e) {
      this.pagenum = e;
      this.getUserList();
    },
    //是否显示添加用户弹窗
    hasAddDialog(flag) {
      this.dialogAdd = flag;
    },
    //是否显示编辑用户弹窗
    hasEditDialog(flag) {
      this.dialogEdit = flag;
    },
    // 是否显示分配角色弹窗
    hasRoleDialog(flag) {
      this.dialogRole = flag;
    },
    //添加用户
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.addUser(this.addUserForm).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 201) {
              //提示信息
              this.$message.success(msg);
              //更新视图
              this.getUserList();
              //清空文本框
              this.addUserForm = {};
              //关闭对话框
              this.hasAddDialog(false);
            } else {
              //提示信息
              this.$message.warning(msg);
            }
          });
        }
      });
    },
    // 编辑用户
    submitEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.editUser(this.editUserForm).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              //提示信息
              this.$message.success(msg);
              //更新视图
              this.getUserList();
              //清空文本框
              this.editUserForm = {};
              //关闭对话框
              this.hasEditDialog(false);
            } else {
              //提示信息
              this.$message.warning(msg);
            }
          });
        }
      });
    },
    //删除用户
    submitDelete(e) {
      this.$confirm("是否删除用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.deleteUser(e).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              //提示信息
              this.$message.success(msg);
              //更新视图
              this.getUserList();
            } else {
              //提示信息
              this.$message.warning(msg);
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除",
          // });
        });
    },
    //分配角色
    submitRole() {
      this.$api.changeUserRole(this.roleUserForm).then((res) => {
        const {
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.$message.success(msg);
        } else {
          this.$message.warning(msg);
        }
        this.hasRoleDialog(false);
      });
    },
    //显示编辑弹窗
    showEditDialog(e) {
      this.editUserForm = {
        id: e.id,
        username: e.username,
        email: e.email,
        mobile: e.mobile,
      };
      this.hasEditDialog(true);
    },
    //显示分配角色弹窗
    async showRoleDialog(e) {
      this.currentUsername = e.username;
      const { data: result } = await this.$api.getUserById(e).then((res) => {
        if (res.data.meta.status == 200) {
          return res.data;
        }
      });
      this.roleUserForm = result;
      const { data: res } = await this.$api.roles().then((res) => {
        if (res.data.meta.status == 200) {
          return res;
        }
      });
      this.rolesList = res.data;
      this.hasRoleDialog(true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
