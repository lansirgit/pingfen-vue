import request from '@/utils/request'

/**
 * 获取表单选项信息
 * @param {*} params 
 * @returns 
 */
export function formOptions(params) { 
  return request({
    url: '/pingfen/get_upload_form/1',
    method: 'get',
    params,
    isToken: false

  })
}

/**
 * 根据赛道获取项目列表
 * @param {*} track 赛道标识，'-1'表示全部赛道
 * @returns 
 */
export function getProjectsByTrack(track) {
  return request({
    url: '/pingfen/get_projects_by_track/1',
    method: 'get',
    params: { track },
    isToken: false
  })
}

/**
 * 上传作品
 * @param {*} data 
 * @returns 
 */
export function uploadEntry(data) {
  return request({
    url: '/pingfen/upload_entry',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}