import http from '../common/http'

//权限列表
export function rights(data) {
  return http.get(`/rights/${data.type}`)
}
//角色列表
export function roles(data) {
  return http.get(`/roles`)
}
//根据id查询角色
export function findRolesById(data) {
  return http.get(`/roles/${data.id}`)
}
//添加角色
export function addRoles(data) {
  return http.post(`/roles`, data)
}
//编辑角色
export function editRoles(data) {
  return http.put(`/roles/${data.roleId}`, data)
}
//删除角色
export function deleRoles(data) {
  return http.delete(`/roles/${data.id}`)
}
//角色授权
export function authRoles(data) {
  return http.post(`roles/${data.roleId}/rights`, {
    rids: data.rids
  })
}
//删除角色指定权限
export function deleRights(data) {
  return http.delete(`/roles/${data.roleId}/rights/${data.rightId}`)
}