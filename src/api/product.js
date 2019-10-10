import request from '@/utils/request'

/**
 * 查询产品列表
 */
export function getProductList() {
  return request({
    url: '/product',
    method: 'get'
  })
}
