import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import StudentIndex from '@/model/student/student_index'
import AdminIndex from '@/model/admin/admin_index'
import TeacherIndex from '@/model/teacher/teacher_index'
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

import QuestionManage from '@/model/teacher/question_manage'
import ExamManage from '@/model/teacher/exam_manage'
import CorrectingPapers from '@/model/teacher/correcting_papers'

import examIndex from '@/components/examIndex'
import ExamList from '@/model/student/exam_list'
import Exam from '@/model/student/exam'


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
      path:'/examIndex',
      name:'examIndex',
      component: examIndex,
      children:[
        {
          path: '/exam',
          name: 'exam',
          component: Exam,
          meta: {
            judgeLogin: true,
          }
        },
      ]
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
          path:'/teacher_index',
          name:'teacher_index',
          component:TeacherIndex,
          meta: {
            judgeLogin: true,
            teacher:true
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
        },{
          path:'/question_manage',
          name:'question_manage',
          component:QuestionManage,
          meta: {
            judgeLogin: true,
            teacher:true
          }
        },{
          path:'/exam_manage',
          name:'exam_manage',
          component:ExamManage,
          meta: {
            judgeLogin: true,
            teacher:true
          }
        },{
          path:'/correcting_papers',
          name:'correcting_papers',
          component:CorrectingPapers,
          meta: {
            judgeLogin: true,
            teacher:true
          }
        },{
          path:'/exam_list',
          name:'exam_list',
          component:ExamList,
          meta: {
            judgeLogin: true
          }
        },
      ]
    }
  ]
})
