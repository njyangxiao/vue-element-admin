import http from '../common/http'


//获取三级分类的信息
export function getGoodList() {
  return http.get('/categories?type=3')
}
//获取三级分类 分页
export function getGoodListByPag(data) {
  return http.get(`/categories?type=3&pagenum=${data.pagenum}&pagesize=${data.pagesize}`)
}

//获取三级分类 父级分类
export function getGoodListParent(data) {
  return http.get(`/categories`, {
    params: data
  })
}

//获取商品参数
export function getGoodParams(data) {
  return http.get(`/categories/${data}/attributes?sel=many`)
}

//获取商品属性
export function getGoodAttr(data) {
  return http.get(`/categories/${data}/attributes?sel=only`)
}

//添加商品
export function goods(data) {
  return http.post('/goods', data)
}

//获取商品列表
export function getGoods(data) {
  return http.get(`/goods?query=${data.query}&pagenum=${data.pagenum}&pagesize=${data.pagesize}`)
}

//删除列表
export function delGoods(data) {
  return http.delete(`/goods/${data.goods_id}`)
}

//编辑提交参数
export function updateParams(data) {
  return http.put(`/categories/${data.id.cat_id}/attributes/${data.id.attr_id}`, data.data)
}