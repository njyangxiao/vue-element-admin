import http from '../common/http'

//获取用户列表
export function getUsers(data) {
  return http.get(`/users?query=${data.query}&pagenum=${data.pagenum}&pagesize=${data.pagesize}`)
}
//获取指定用户
export function getUserById(data) {
  return http.get(`/users/${data.id}`)
}
//添加用户
export function addUser(data) {
  return http.post("/users", data)
}
//删除用户
export function deleteUser(data) {
  return http.delete(`/users/${data.id}`)
}
//编辑用户
export function editUser(data) {
  return http.put(`/users/${data.id}`, data)
}
//改变用户状态
export function changeUserStatus(data) {
  return http.put(`/users/${data.id}/state/${data.mg_state}`)
}
//分配角色
export function changeUserRole(data) {
  return http.put(`/users/${data.id}/role`, data)
}
//角色列表
export function roles(data) {
  return http.get(`roles`)
}