import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' //  Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '@/utils/auth' //  验权

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 设置可以不用登录的访问页面

router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 获取登录后存入的getToken
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果从登录界面过来直接首页
      next({ path: '/' })
      // 关闭进度条动画
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('getInfo').then(res => { // 拉取用户信息
          // 获取menus
          const menus = res.data.menus
          // 获取username
          const username = res.data.username
          store.dispatch('GenerateRoutes', { menus, username }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('fedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {// 不存getToken或者失效的情况
    if (whiteList.indexOf(to.path) !== -1) {// 不需要权限的页面直接进入
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 关闭进度条动画
  NProgress.done()
})
