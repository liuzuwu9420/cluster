import {fetch} from '@/utils/request'

/**
 * 登录
 * @param {*} params 登录参数
 */
export function login(params) {
  return fetch('/userLogin', params)
}
