import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 根据UUID获取tags
 * @param {*} UUID UUID
 */
export function GetTags(UUID) {
  return request({
    url: `/labels/${UUID}`,
    method: 'get'
  })
}

/**
 * 根据UUID添加tags
 * @param {*} data 添加参数
 */
export function CreateTags(data) {
  return request({
    url: `/labels`,
    method: 'post',
    data
  })
}

/**
 * 根据UUID删除tags
 * @param {*} UUID tags的UUID
 */
export function DeleteTags(UUID) {
  return request({
    url: `/labels/${UUID}`,
    method: 'delete'
  })
}
