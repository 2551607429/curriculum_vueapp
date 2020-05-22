import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;
import axios from 'axios'



/**
 * 题库管理
 */

/**
 * 分页获取题库详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const questionInit = (params) => {
  return http.requestPost( apiUrl+'/teacher/question_init', params);
};

/**
 * 增加题库题目
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addQuestion = (params) => {
  return http.requestPost( apiUrl+'/teacher/add_question', params);
};


/**
 * 上传题库题目文件
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const uploadQuestion = (params) => {
  return http.requestPost( apiUrl+'/teacher/upload_question', params);
};

/**
 * 删除题库信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteQuestion = (params) => {
  return http.requestPost( apiUrl+'/teacher/delete_question', params);
};


/**
 * 修改题库信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editQuestion = (params) => {
  return http.requestPost( apiUrl+'/teacher/edit_question', params);
};


/**
 * 获取所有的题型信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const typeInfo = () => {
  return http.requestPost( apiUrl+'/teacher/type_info');
};


/**
 * 获取所有的章节信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const chapterInfo = () => {
  return http.requestPost( apiUrl+'/teacher/chapter_info');
};


/**
 * 考试管理
 */

/**
 * 分页获取考试详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const examInit = (params) => {
  return http.requestPost( apiUrl+'/teacher/exam_init', params);
};

/**
 * 增加考试
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addExam = (params) => {
  return http.requestPost( apiUrl+'/teacher/add_exam', params);
};


/**
 * 删除考试信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteExam = (params) => {
  return http.requestPost( apiUrl+'/teacher/delete_exam', params);
};


/**
 * 修改考试信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editExam = (params) => {
  return http.requestPost( apiUrl+'/teacher/edit_exam', params);
};

/**
 * 获取自己任课的所有课程信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const curriculumInfo = (params) => {
  return http.requestPost( apiUrl+'/teacher/curriculum_info', params);
};


/**
 * 获取自己任课的所有班级信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const classInfo = (params) => {
  return http.requestPost( apiUrl+'/teacher/class_info', params);
};



/**
 * 获取自己任课的所有班级信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const questionCountType = (params) => {
  return http.requestPost( apiUrl+'/teacher/question_count_type', params);
};

