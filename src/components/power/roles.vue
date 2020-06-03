<template>
  <div>
    <nav-crumbs>
      <template #level1>权限管理</template>
      <template #level2>角色列表</template>
    </nav-crumbs>
    <el-card class="box-card">
      <el-button type="primary" @click="dialogAdd = true">添加角色</el-button>
      <el-table class="table" :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              :key="item1"
            >
              <!-- 一级权限 -->
              <el-col :span="4">
                <el-tag closable @close="deleRights(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二 三 级权限 -->
              <el-col :span="20">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  :key="item2"
                >
                  <el-col :span="5">
                    <!-- 二级权限 -->
                    <el-tag
                      closable
                      @close="deleRights(scope.row, item2.id)"
                      type="success"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <!-- 三级权限 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3"
                      closable
                      @close="deleRights(scope.row, item3.id)"
                      type="warning"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <span v-if="scope.row.children.length == 0">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRoles(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleRolesSubmit(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="showAuthRoles(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogAdd">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addRolesSubmit('addForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogEdit">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editRolesSubmit('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog title="修改权限" :visible.sync="dialogAuth" @close="cancel">
      <el-tree
        :data="treeList"
        show-checkbox
        ref="tree"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        :props="defaultProps"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="authRolesSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("角色名称不能为空"));
      } else {
        callback();
      }
    };
    var validateRoleDesc = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("角色描述不能为空"));
      } else {
        callback();
      }
    };
    return {
      // 是否显示添加角色弹窗
      dialogAdd: false,
      // 是否显示编辑角色弹窗
      dialogEdit: false,
      // 是否显示修改权限弹窗
      dialogAuth: false,
      // 角色列表
      roleList: [],
      // 添加角色的数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑角色的数据
      editForm: {},
      //添加角色规则
      addRules: {
        roleName: [
          { validator: validateRoleName, required: true, trigger: "blur" },
        ],
        roleDesc: [
          { validator: validateRoleDesc, required: true, trigger: "blur" },
        ],
      },
      // 编辑角色规则
      editRules: {
        roleName: [
          { validator: validateRoleName, required: true, trigger: "blur" },
        ],
        roleDesc: [
          { validator: validateRoleDesc, required: true, trigger: "blur" },
        ],
      },
      treeList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defkeys: [],
      roleId: 0,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //获取角色列表
    getRolesList() {
      this.$api.roles().then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        this.roleList = data;
      });
    },
    //添加角色
    addRolesSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.addRoles(this.addForm).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 201) {
              this.$message.success(msg);
              this.dialogAdd = false;
              this.addForm = {};
              this.getRolesList();
            } else {
              this.$message.error(msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 显示编辑角色弹窗
    showEditRoles(roles) {
      this.$api.findRolesById(roles).then((res) => {
        const {
          data,
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.editForm = data;
          this.dialogEdit = true;
        }
      });
    },
    // 编辑角色
    editRolesSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.editRoles(this.editForm).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              this.$message.success("更新成功");
              this.dialogEdit = false;
              this.editForm = {};
              this.getRolesList();
            } else {
              this.$message.error(msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 删除角色
    deleRolesSubmit(roles) {
      this.$confirm("此操作将永久删除角色,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.deleRoles(roles).then((res) => {
            const {
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              this.$message.success(msg);
              this.getRolesList();
            } else {
              this.$message.error(msg);
            }
          });
        })
        .catch(() => {});
    },
    //删除权限
    deleRights(role, rightId) {
      this.$confirm("是否删除此权限?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            roleId: role.id,
            rightId,
          };
          this.$api.deleRights(data).then((res) => {
            const {
              data,
              meta: { msg, status },
            } = res.data;
            if (status == 200) {
              this.roleList.forEach((item, i) => {
                if (item.id == role.id) {
                  this.roleList[i].children = data;
                }
              });
              this.$message.success(msg);
            } else {
              this.$message.warning(msg);
            }
          });
        })
        .catch(() => {});
    },
    //显示角色授权弹窗
    async showAuthRoles(role) {
      this.roleId = role.id;
      const data = await this.$api.rights({ type: "tree" }).then((res) => {
        return res.data;
      });
      if (data.meta.status != 200) {
        return this.$message.error(data.meta.msg);
      }
      this.treeList = data.data;
      this.getDefkeys(role, this.defkeys);
      this.dialogAuth = true;
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    async getDefkeys(arr, newArr) {
      if (!arr.children) {
        newArr.push(arr.id);
        return newArr;
      }
      await arr.children.forEach((item) => this.getDefkeys(item, newArr));
    },
    // 角色授权
    authRolesSubmit() {
      var key = [
        ...this.$refs.tree.getCheckedKeys(), //树形结构中 全选id
        ...this.$refs.tree.getHalfCheckedKeys(), //树形结构中 半选id
      ];
      var rids = key.join(",");
      var data = {
        rids,
        roleId: this.roleId,
      };
      this.$api.authRoles(data).then((res) => {
        const {
          meta: { msg, status },
        } = res.data;
        if (status == 200) {
          this.$message.success(msg);
          this.getRolesList();
          this.dialogAuth = false;
        } else {
          this.$message.error(msg);
        }
      });
    },
    cancel() {
      this.addForm = {};
      this.editForm = {};
      this.defkeys = [];
      this.dialogAdd = false;
      this.dialogEdit = false;
      this.dialogAuth = false;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
