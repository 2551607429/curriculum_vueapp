import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import StudentIndex from '@/model/student/student_index'
import AdminIndex from '@/model/admin/admin_index'
import coop from '@/model/base/components/cooperation'
import Login from "../model/home/login"
import Register from "../model/home/register"
import NoticeInfo from "../model/common/notice_info"
import UserInfo from "../model/common/user_info"
import Password from "../model/common/password"
import TypeManage from '@/model/admin/type_manage'
import CurriculumManage from '@/model/admin/curriculum_manage'
import ChapterManage from '@/model/admin/chapter_manage'
import StudentManage from '@/model/admin/student_manage'
import TeacherManage from '@/model/admin/teacher_manage'
import TeachingManage from '@/model/admin/teaching_manage'
import AdminManage from '@/model/admin/admin_manage'
import NoticeManage from '@/model/admin/notice_manage'
import RegisterManage from '@/model/admin/register_manage'
import CollegeManage from '@/model/admin/college_manage'
import ClassManage from '@/model/admin/class_manage'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/register',
      name:'register',
      component:Register
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld,
      children:[
        {
          path: '/student_index',
          name: 'student_index',
          component: StudentIndex,
          meta: {
            judgeLogin: true,
          }
        },{
          path:'/notice_info',
          name:'notice_info',
          component:NoticeInfo,
          meta: {
            judgeLogin: true,
          }
        },{
          path:'/user_info',
          name:'user_info',
          component:UserInfo,
          meta: {
            judgeLogin: true,
          }
        },{
          path:'/password',
          name:'password',
          component:Password,
          meta: {
            judgeLogin: true,
          }
        },{
          path:'/admin_index',
          name:'admin_index',
          component:AdminIndex,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/type_manage',
          name:'type_manage',
          component:TypeManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/curriculum_manage',
          name:'curriculum_manage',
          component:CurriculumManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/chapter_manage',
          name:'chapter_manage',
          component:ChapterManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/student_manage',
          name:'student_manage',
          component:StudentManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/teacher_manage',
          name:'teacher_manage',
          component:TeacherManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/teaching_manage',
          name:'teaching_manage',
          component:TeachingManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/admin_manage',
          name:'admin_manage',
          component:AdminManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/notice_manage',
          name:'notice_manage',
          component:NoticeManage,
          meta: {
            judgeLogin: true,
          }
        },{
          path:'/register_manage',
          name:'register_manage',
          component:RegisterManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/college_manage',
          name:'college_manage',
          component:CollegeManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },{
          path:'/class_manage',
          name:'class_manage',
          component:ClassManage,
          meta: {
            judgeLogin: true,
            admin:true
          }
        },
      ]
    },
    {
      path: '/xx',
      name: 'coop',
      component: coop,
    }
  ]
})
