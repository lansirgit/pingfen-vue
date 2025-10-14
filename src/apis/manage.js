import request from '@/utils/request'

/**
 * 获取表数据
 * @param {*} data 
 * @returns 
 */
export function listTable(data) { 
  return request({
    url: `/pingfen/admin/get_table_data/${data.tableName}`,
    method: 'get',
    data,
    isToken: false
  })
}

/**
 * 获取单条记录
 * @param {String} tableName 表名
 * @param {Number} recordId 记录ID
 * @returns 
 */
export function getRecord(tableName, recordId) {
  return request({
    url: `/pingfen/admin/get_record/${tableName}/${recordId}`,
    method: 'get'
  })
}

/**
 * 添加记录
 * @param {String} tableName 表名
 * @param {Object} data 记录数据
 * @returns 
 */
export function addRecord(tableName, data) {
  return request({
    url: `/pingfen/admin/add_record/${tableName}`,
    method: 'post',
    data
  })
}

/**
 * 更新记录
 * @param {String} tableName 表名
 * @param {Number} recordId 记录ID
 * @param {Object} data 更新的数据
 * @returns 
 */
export function updateRecord(tableName, recordId, data) {
  return request({
    url: `/pingfen/admin/update_record/${tableName}/${recordId}`,
    method: 'put',
    data
  })
}

/**
 * 删除记录
 * @param {String} tableName 表名
 * @param {Number} recordId 记录ID
 * @returns 
 */
export function deleteRecord(tableName, recordId) {
  return request({
    url: `/pingfen/admin/delete_record/${tableName}/${recordId}`,
    method: 'delete'
  })
}

/**
 * 获取作品信息
 * @param {*} data 
 * @returns 
 */
export function listEntries(data) { 
  return request({
    url: `/pingfen/admin/get_entries`,
    method: 'post',
    data,
    isToken: false
  })
}