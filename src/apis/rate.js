import request from '@/utils/request'

/**
 * 获取评分概况
 * @param {*} data 
 * @returns 
 */
export function listRate(data) { 
  return request({
    url: '/pingfen/get_judge_projects',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取已评分作品列表
 * @param {*} data 
 * @returns 
 */
export function listReviewed(data) { 
  return request({
    url: '/pingfen/get_reviewed_entries',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取未评分作品列表
 * @param {*} data 
 * @returns 
 */
export function listUnreviewed(data) { 
  return request({
    url: '/pingfen/get_unreviewed_entries',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取评分细则
 * @param {*} data 
 * @returns 
 */
export function detailDimensions(data) { 

  return request({
    url: '/pingfen/get_evaluation_dimensions',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 获取作品详情
 * @param {*} data 
 * @returns 
 */
export function detailEntry(data) { 
  return request({
    url: '/pingfen/get_entry_info',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 评委登录
 * @param {*} data 
 * @returns 
 */
export function rateLogin(data) { 
  return request({
    url: '/pingfen/login',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 评委注册
 * @param {*} data 
 * @returns 
 */
export function rateRegister(data) { 
  return request({
    url: '/pingfen/judge_register',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 查询评委信息
 * @param {*} data 
 * @returns 
 */
export function rateInfo(data) { 
  return request({
    url: '/pingfen/get_judge_info',
    method: 'post',
    data,
    isToken: false
  })
}

/**
 * 提交评分
 * @param {*} data 
 * @returns 
 */
export function submitRate(data) { 
  return request({
    url: '/pingfen/submit_detailed_score',
    method: 'post',
    data,
    isToken: false
  })
}
