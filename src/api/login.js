import http from '../common/http'

export function login(data) {
  return http.post('/login', data)
}