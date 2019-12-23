import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 登录
 * @param {*} data 登录参数
 */
export function login(data) {
  return request({
    url: `/users/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function centrifugeToken() {
  return request({
    url: '/centrifugo/token',
    method: 'post'
  })
}
