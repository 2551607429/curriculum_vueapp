// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
import VueParticles from 'vue-particles'
import {setCookie,getCookie,delCookie} from '@/model/base/api/util.js'
Vue.prototype.$echarts = echarts;
Vue.use(VueParticles);
Vue.use(Vant);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$cookieStore = {
  setCookie,
  getCookie,
  delCookie
};


//判断当前有没有登录
router.beforeEach((to, from, next) => {
  //判断跳转路径需不需要判断是否登录
  if (to.matched.some(m => m.meta.judgeLogin)) {
    //是否可以获取到用户名
    if (getCookie('username') !== null) {
      //是否判断当前用户是否是管理员
      if (to.matched.some(m => m.meta.admin)) {
        //当前身份是否 是管理员
        if (getCookie('option') === '3') {
          next()
        }
        else {
          next({path: '/login'});
          Vue.prototype.$message.warning('检测到您不是管理员,请登录管理员账号后操作！')
        }
      }
      //是否判断当前用户是否是教师
      else if (to.matched.some(m => m.meta.teacher)) {
        //当前身份是否 是教师
        if (getCookie('option') === '2') {
          next()
        }
        else {
          next({path: '/login'});
          Vue.prototype.$message.warning('检测到您不是教师,请登录教师账号后操作！')
        }
      }
      else{
        next();
      }
    }
    else {
      next({path: '/login'});
      Vue.prototype.$message.warning('检测到您还未登录,请登录后操作！')
    }
  }
  else {
    next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
