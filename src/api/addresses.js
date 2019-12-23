import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 获取服务器地址
 *  * @param {*} params 请求地址
 */
export function getAddress(params) {
  return request({
    url: `/sys/configs`,
    method: 'get',
    params
  })
}
/**
 * 根据名称获取服务器地址
 *  * @param {*} params 请求地址
 */
export function getAddressByName(name) {
  return request({
    url: `/sys/configs/${name}`,
    method: 'get'
  })
}
/**
 * 修改服务器地址
 *  * @data {*} 提交数据
 */
export function modifyAddress(data) {
  return request({
    url: `/sys/configs`,
    method: 'post',
    data
  })
}
