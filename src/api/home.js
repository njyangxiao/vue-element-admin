import http from '../common/http'

export function getMenus() {
  return http.get('/menus')
}


export function getReports(data) {
  return http.get(`/reports/type/${data}`)
}