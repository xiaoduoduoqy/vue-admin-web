import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { shuju } from '@/store/mooni/shuju'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 登录
    login({ commit }, userInfo) { // actions的第一个参数为context 上下文 {commit}==actions.commit
      const username = userInfo.username.trim()// 去除空格
      return new Promise((resolve, reject) => {
        // 传给相关服务接口
        login(username, userInfo.password).then(response => {
          // 获取用户基本信息
          const data = response.data
          // 拼接相关token相关信息
          const tokenStr = data.tokenHead + '" " ' + data.token
          // 保存相关 token
          setToken(tokenStr)
          // 修改state的相关值
          commit('SET_TOKEN', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getInfo({ commit, state }, udrtId) {
      return new Promise((resolve, reject) => {
        getInfo(udrtId).then(response => {
          // 获取后台返回的用户权限相关信息
          // const { data } = response
          const { data } = shuju
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            // 修改修改state的相关值
            commit('SET_ROLES', data.roles)
            // resolve(response)
            resolve(shuju) // 模拟数据
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          // 修改state的相关值
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.icon)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端登出
    fedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

