import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */
const v = 'v1'

/**
 * 根据UUID获取tags
 * @param {*} UUID UUID
 */
export function GetTags(UUID) {
  return request({
    url: `/api/${v}/labels/${UUID}`,
    method: 'get'
  })
}

/**
 * 根据UUID添加tags
 * @param {*} data 添加参数
 */
export function CreateTags(data) {
  return request({
    url: `/api/${v}/labels`,
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
    url: `/api/${v}/labels/${UUID}`,
    method: 'delete'
  })
}
