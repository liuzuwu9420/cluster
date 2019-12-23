import request from '@/utils/request'

/**
 * 版本
 * @constant
 * @type {string}
 * @default
 * */

/**
 * 根据uuid查询标签信息
 * @param {*} UUID 主机UUID
 */
export function GetTagsByUUID(UUID) {
  return request({
    url: `/labels/${UUID}`,
    method: 'get'
  })
}

/**
 * 获取所有tags
 *  * @param {*} params 包含分页查询和查询参数
 */
export function GetAllTags(params) {
  return request({
    url: `/labels`,
    method: 'get',
    params
  })
}

/**
 * 获取去重后的所有key
 *  * @param {*} params 包含分页查询和查询参数
 */
export function GetAllKeys(params) {
  return request({
    url: `/labels/keys`,
    method: 'get',
    params
  })
}

/**
 * 获取某个key下所有values
 *  * @param key 标签key
 *  * @param {*} params 包含分页查询和查询参数
 */
export function GetValuesByKey(key, params) {
  return request({
    url: `/labels/keys/${key}/values`,
    method: 'get',
    params
  })
}

/**
 * 获取某个标签绑定的所有资源
 *  * @param tagUUID 标签uuid
 *  * @param {*} params 包含分页查询和查询参数
 */
export function GetHostsByTag(tagUUID, params) {
  return request({
    url: `/labels/${tagUUID}/resources`,
    method: 'get',
    params
  })
}

/**
 * 添加tags
 * @param { {LabelKey:"price" , LabelValue:"2"} } data 添加的标签信息
 */
export function CreateTag(data) {
  return request({
    url: `/labels`,
    method: 'post',
    data
  })
}

/**
 * 更新标签
 * @param {{"UUID","LabelKey","LabelValue"}} data 修改后的标签内容
 */
export function ModifyTag(data) {
  return request({
    url: `/labels`,
    method: 'put',
    data
  })
}

/**
 * 根据uuid删除label，同时解绑所有已经关联的资源
 * @param {*} UUID tags的UUID
 */
export function DeleteTags(UUID) {
  return request({
    url: `/labels/${UUID}`,
    method: 'delete'
  })
}

