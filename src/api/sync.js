import request from '@/utils/request'

//版本
let v = "v1"

// 同步用户数据
export function syncUser() {
  return request({
    url: `/api/${v}/users/sync`,
    method: 'post'
  })
}

// 同步用户组数据
export function syncGroup() {
  return request({
    url: `/api/${v}/groups/sync`,
    method: 'post'
  })
}
