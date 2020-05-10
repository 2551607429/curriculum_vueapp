import http from './../../base/api/public'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

//获取与该用户相关的公告信息
export const noticeCount = (params) => {
  return http.requestPost( apiUrl+'/sys/notice_count',params);
}
