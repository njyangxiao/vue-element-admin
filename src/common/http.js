import axios from 'axios';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000
})

// request拦截器
service.interceptors.request.use(
  config => {
    let token = Cookies.get('token')
    if (token) {
      config.headers = {
        // Authorization: 'Bearer ' + token
        Authorization: token

      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

//response拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response
    } else {
      return Promise.reject({
        msg: response.data.msg,
        data: response.data
      })
    }
  },
  error => {
    return Promise.reject({
      msg: '网络错误',
      err: error
    })
  }
)

// 把axios放到全局中
// Vue.prototype.$http = service

export default service