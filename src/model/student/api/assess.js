import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;
import axios from 'axios'



/**
 * 课程考核
 */

/**
 * 分页获取未考试列表
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const examListInit = (params) => {
  return http.requestPost( apiUrl+'/student/exam_init', params);
};


/**
 * 获取考试题目信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const paperInit = (params) => {
  return http.requestPost( apiUrl+'/student/paper_init', params);
};



/**
 * 提交试卷
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const submitPaper = (params) => {
  return http.requestPost( apiUrl+'/student/submit_paper', params);
};

