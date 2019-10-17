import request from '@/utils/request'
//import {fetch} from '@/utils/request'

/**
 * 登录
 * @param {*} data 登录参数
 */
export function login(data) {
  return request({
    url: '/userLogin',
    method: 'post',
    data
  })
  //return fetch('/userLogin', params)
}
