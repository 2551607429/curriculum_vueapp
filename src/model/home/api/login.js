import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

// let sysConfig = require('@/../config/sysConfig')
// let apiUrl = sysConfig.xcApiUrlPre;
//登录
export const login = (params) => {
  return http.requestPost( apiUrl+'/sys/login', params);
};

//获取班级数据
export const classInfo = () => {
  return http.requestPost( apiUrl+'/sys/class_info');
};

//获取班级名称数据
export const className = () => {
  return http.requestPost( apiUrl+'/sys/class_name');
};

//获取学院数据
export const collegeInfo = () => {
  return http.requestPost( apiUrl+'/sys/college_info');
};

//获取学院名称数据
export const collegeName = () => {
  return http.requestPost( apiUrl+'/sys/college_name');
};

//验证用户名是否唯一
export const userNameUnique = (params) => {
  return http.requestPost( apiUrl+'/sys/username_unique',params);
};

//验证教师编号是否唯一
export const teacherIdUnique = (params) => {
  return http.requestPost( apiUrl+'/sys/teacherId_unique',params);
};

//验证注册码是否正确
export const checkKey = (params) => {
  return http.requestPost( apiUrl+'/sys/check_key',params);
};

//注册用户信息
export const register = (params) => {
  return http.requestPost( apiUrl+'/sys/register',params);
};
