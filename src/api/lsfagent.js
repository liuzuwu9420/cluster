import request from '@/utils/request'
const esUrl = `/lsfagent/api/v1`

/**
 * 获取es搜索返回数据
 * @param {*} data 查询语句
 */
export function getEsDataBySql(data) {
  return request({
    url: `${esUrl}/_opendistro/_sql?format=json`,
    method: 'post',
    data
  })
}
