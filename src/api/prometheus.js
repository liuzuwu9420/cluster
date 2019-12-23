import request from '@/utils/prometheus-request'

/**
 * 获取prometheus数据
 * @param {*} params prometheus参数
 */
export function GetPrometheus(params) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取cpu总数
 * @param {*} params 查询语句
 */
export function GetAllCpu(params = { query: 'cluster:cpu:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取内存总数
 * @param {*} params 查询语句
 */
export function GetAllMem(params = { query: 'cluster:memory_total_size_bytes:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取可用内存用量
 * @param {*} params 查询语句
 */
export function GetUnusedMem(params = { query: 'cluster:memory_available_size_bytes:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取集群节点总量
 * @param {*} params 查询语句
 */
export function GetAllNode(params = { query: 'cluster:node:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取集群节点开机数
 * @param {*} params 查询语句
 */
export function GetUsedNode(params = { query: 'cluster:node_up:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取集群存储总量
 * @param {*} params 查询语句
 */
export function GetAllFs(params = { query: 'cluster:filesystem_total_size_bytes:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}

/**
 * 获取集群存储用量
 * @param {*} params 查询语句
 */
export function GetUnusedFs(params = { query: 'cluster:filesystem_available_size_bytes:sum' }) {
  return request({
    url: `/query`,
    method: 'get',
    params
  })
}
