import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;


//获取当前用户的公告
export const noticeInit = (params) => {
  return http.requestPost( apiUrl+'/sys/notice_init', params);
};

//更改公告状态
export const noticeState = (params) => {
  return http.requestPost( apiUrl+'/sys/notice_state', params);
};

//获取用户信息
export const userInfo = (params) => {
  return http.requestPost( apiUrl+'/sys/user_info', params);
};

//更改用户信息
export const updateUserInfo = (params) => {
  return http.requestPost( apiUrl+'/sys/update_userInfo', params);
};

//修改密码
export const updatePwd = (params) => {
  return http.requestPost( apiUrl+'/sys/update_pwd', params);
};
