import * as home from './home'
import * as login from './login'
import * as users from './users'
import * as rights from './rights'
import * as goods from './goods'

const apiObj = {
  ...home,
  ...login,
  ...users,
  ...rights,
  ...goods,
}
const install = function (Vue) {
  if (install.installed) return
  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}