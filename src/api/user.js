import request from '@/utils/request'

/**
 * 登录返回相关tonken
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/admin/login/',
    method: 'post',
    data
  })
}

/**
 * 获取相关人员相关权限
 * @param token
 * @returns {AxiosPromise}
 */
export function getInfo(token) {
  return request({
    url: '/admin/permission/3',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
