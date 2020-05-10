import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;
import axios from 'axios'

/**
 * 题型管理
 */


/**
 * 获取题型详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const typeInit = (params) => {
  return http.requestPost( apiUrl+'/admin/type_init', params);
};

/**
 * 增加题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addType = (params) => {
  return http.requestPost( apiUrl+'/admin/add_type', params);
};

/**
 * 删除题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteType = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_type', params);
};


/**
 * 修改题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editType = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_type', params);
};


/**
 * 课程管理
 */

/**
 * 分页获取课程详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const curriculumInit = (params) => {
  return http.requestPost( apiUrl+'/admin/curriculum_init', params);
};

/**
 * 增加课程信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addCurriculum = (params) => {
  return http.requestPost( apiUrl+'/admin/add_curriculum', params);
};


/**
 * 上传课程信息文件
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const uploadCurriculum = (params) => {
  return http.requestPost( apiUrl+'/admin/upload_curriculum', params);
};

/**
 * 删除课程信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteCurriculum = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_curriculum', params);
};


/**
 * 修改课程信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editCurriculum = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_curriculum', params);
};



/**
 * 题型管理
 */


/**
 * 获取题型详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const chapterInit = (params) => {
  return http.requestPost( apiUrl+'/admin/chapter_init', params);
};

/**
 * 增加题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addChapter = (params) => {
  return http.requestPost( apiUrl+'/admin/add_chapter', params);
};

/**
 * 删除题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteChapter = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_chapter', params);
};


/**
 * 修改题型
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editChapter = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_chapter', params);
};


/**
 * 用户管理
 */

/**
 * 分页获取用户详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const userInit = (params) => {
  return http.requestPost( apiUrl+'/admin/user_init', params);
};

/**
 * 增加用户信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addUser = (params) => {
  return http.requestPost( apiUrl+'/admin/add_users', params);
};


/**
 * 上传用户信息文件
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const uploadUser = (params) => {
  return http.requestPost( apiUrl+'/admin/upload_user', params);
};

/**
 * 删除用户信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteUser = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_user', params);
};


/**
 * 修改用户信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editUser = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_user', params);
};


/**
 * 公告管理
 */

/**
 * 分页获取公告详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const noticeInit = (params) => {
  return http.requestPost( apiUrl+'/admin/notice_init', params);
};

/**
 * 增加公告信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addNotice = (params) => {
  return http.requestPost( apiUrl+'/admin/add_notice', params);
};


/**
 * 删除公告信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteNotice = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_notice', params);
};


/**
 * 修改公告信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editNotice = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_notice', params);
};


/**
 * 注册管理
 */


/**
 * 获取注册码详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const registerInit = (params) => {
  return http.requestPost( apiUrl+'/admin/register_init', params);
};


/**
 * 修改注册码
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editRegister = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_register', params);
};



/**
 * 二级学院管理
 */


/**
 * 获取二级学院详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const collegeInit = (params) => {
  return http.requestPost( apiUrl+'/admin/college_init', params);
};

/**
 * 增加二级学院
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addCollege = (params) => {
  return http.requestPost( apiUrl+'/admin/add_college', params);
};

/**
 * 删除二级学院
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteCollege = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_college', params);
};


/**
 * 修改二级学院
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editCollege = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_college', params);
};



/**
 * 班级管理
 */


/**
 * 获取班级详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const classInit = (params) => {
  return http.requestPost( apiUrl+'/admin/class_init', params);
};

/**
 * 增加班级
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addClass = (params) => {
  return http.requestPost( apiUrl+'/admin/add_class', params);
};

/**
 * 删除班级
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteClass = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_class', params);
};


/**
 * 修改班级
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editClass = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_class', params);
};



/**
 * 任课管理
 */

/**
 * 分页获取任课详情
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const teachingInit = (params) => {
  return http.requestPost( apiUrl+'/admin/teaching_init', params);
};

/**
 * 增加任课信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const addTeaching = (params) => {
  return http.requestPost( apiUrl+'/admin/add_teaching', params);
};


/**
 * 上传任课信息文件
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const uploadTeaching = (params) => {
  return http.requestPost( apiUrl+'/admin/upload_teaching', params);
};

/**
 * 删除任课信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const deleteTeaching = (params) => {
  return http.requestPost( apiUrl+'/admin/delete_teaching', params);
};


/**
 * 修改任课信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const editTeaching = (params) => {
  return http.requestPost( apiUrl+'/admin/edit_teaching', params);
};


/**
 * 获取所有的教师信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const teacherInfo = (params) => {
  return http.requestPost( apiUrl+'/admin/teacher_info', params);
};

/**
 * 获取所有的课程信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const curriculumInfo = (params) => {
  return http.requestPost( apiUrl+'/admin/curriculum_info', params);
};


/**
 * 获取任课信息中的所有筛选信息
 * @param params
 * @returns {Promise | Promise<unknown>}
 */
export const teachingInfo = () => {
  return http.requestPost( apiUrl+'/admin/teaching_info');
};

