import request from '@/utils/request'

/**
 * 获取参赛作品结果
 * @param {*} data 
 * @returns 
 */
export function listEntry(data) { 
  return request({
    url: '/pingfen/get_entry_list',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取当前用户参赛作品结果
 * @param {*} data 
 * @returns 
 */
export function listUserEntry(data) { 
  return request({
    url: `/pingfen/api/participant_entries_rank/${data.participantID}`,
    method: 'get',
    data,
    isToken: false
  })
}