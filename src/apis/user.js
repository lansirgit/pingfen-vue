import request from '@/utils/request'


/**
 * 用户登录
 * @param {*} data 
 * @returns 
 */
export function userLogin(data) { 

  return request({
    url: '/pingfen/participant_login',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 用户注册
 * @param {*} data 
 * @returns 
 */
export function userRegister(data) { 

  return request({
    url: '/pingfen/participant_register',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取用户信息
 * @param {*} data 
 * @returns 
 */
export function userInfo(data) { 

  return request({
    url: `/pingfen/api/participant/${data.id}`,
    method: 'get',
    data,
    isToken: false
  })
}

/**
 * 获取用户作品信息
 * @param {*} data 
 * @returns 
 */
export function userEntries(data) {

  return request({
    url: `/pingfen/api/participant_entries_rank/${data.id}`,
    method: 'get',
    data,
    isToken: false
  })
}

/**
 * 修改用户信息
 * @param {*} data 
 * @returns 
 */
export function userUpdate(data) {

  return request({
    url: `/pingfen/api/participant/${data.id}`,
    method: 'put',
    data,
    isToken: false
  })
}

/**
 * 查询用户作品信息
 * @param {*} data 
 * @returns 
 */
export function userEntry(data) {

  return request({
    url: `/pingfen/api/get_project_entry`,
    method: 'post',
    data,
    isToken: false
  })
}