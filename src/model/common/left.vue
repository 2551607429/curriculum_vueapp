<template>
  <div class="leftBorder">
    <div class="left" v-bind:style="{display: menuStyle1}">
      <el-menu
        :default-active = "this.$route.path"
        :router = "true"
        class="child-item"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#bfcbd9"
        :unique-opened="true"
        active-text-color="#409eff">
        <el-menu-item index="1" route="/student_index">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-notebook-1"></i>
            <span slot="title">学习知识</span>
          </template>
          <el-menu-item index="2-1">已选课程</el-menu-item>
          <el-menu-item index="2-2">学习课程知识</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-document"></i>
            <span slot="title">课程考核</span>
          </template>
          <el-menu-item index="/exam_list">参加考核</el-menu-item>
          <el-menu-item index="/exam_score">查看考核详情</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="left" v-bind:style="{display: menuStyle2}">
      <el-menu
        :default-active = "this.$route.path"
        :router = "true"
        class="child-item"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#bfcbd9"
        :unique-opened="true"
        active-text-color="#409eff">
        <el-menu-item index="/teacher_index" class="first">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-management"></i>
            <span slot="title">考核管理</span>
          </template>
          <el-menu-item index="/question_manage"><i class="el-icon-s-order"></i>题库管理</el-menu-item>
          <el-menu-item index="/exam_manage"><i class="el-icon-collection"></i>考试管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span slot="title">学习管理</span>
          </template>
          <el-menu-item index="/"><i class="el-icon-user"></i>知识点管理</el-menu-item>
          <el-menu-item index="/"><i class="el-icon-user-solid"></i>查看学习情况</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item index="/notice_manage"><i class="el-icon-message-solid"></i>公告管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="left" v-bind:style="{display: menuStyle3}">
      <el-menu
        :default-active = "this.$route.path"
        :router = "true"
        class="child-item"
        @open="handleOpen"
        @close="handleClose"
        background-color="#304156"
        text-color="#bfcbd9"
        :unique-opened="true"
        active-text-color="#409eff">
        <el-menu-item index="/admin_index" class="first">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-management"></i>
            <span slot="title">考核管理</span>
          </template>
          <el-menu-item index="/type_manage"><i class="el-icon-s-order"></i>题型管理</el-menu-item>
          <el-menu-item index="/curriculum_manage"><i class="el-icon-collection"></i>课程管理</el-menu-item>
          <el-menu-item index="/chapter_manage"><i class="el-icon-s-fold"></i>章节管理</el-menu-item>
          <el-menu-item index="2-4"><i class="el-icon-s-data"></i>考核详情</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span slot="title">成员管理</span>
          </template>
          <el-menu-item index="/student_manage"><i class="el-icon-user"></i>学生管理</el-menu-item>
          <el-menu-item index="/teacher_manage"><i class="el-icon-user-solid"></i>教师管理</el-menu-item>
          <el-menu-item index="/teaching_manage"><i class="el-icon-data-analysis"></i>任课管理</el-menu-item>
          <el-menu-item index="/admin_manage"><i class="el-icon-s-custom"></i>管理员管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item index="/notice_manage"><i class="el-icon-message-solid"></i>公告管理</el-menu-item>
          <el-menu-item index="/register_manage"><i class="el-icon-coin"></i>注册管理</el-menu-item>
          <el-menu-item index="/college_manage"><i class="el-icon-school"></i>二级学院管理</el-menu-item>
          <el-menu-item index="/class_manage"><i class="el-icon-office-building"></i>班级管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
    export default {
      name: "left",
      data(){
        return{
          adminMenu: '1',
          menuStyle1: "",
          menuStyle2: "none",
          menuStyle3: "none",
          loginInfo:{
            username: this.$cookieStore.getCookie("username"),
            option: this.$cookieStore.getCookie("option")
          },
        }
      },
      created(){
        this.selectMenu()
      },
      methods: {
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
        selectMenu:function () {
          if(this.loginInfo.option === '1'){
            this.menuStyle1 = "";
            this.menuStyle2 = "none";
            this.menuStyle3 = "none";
          }
          else if(this.loginInfo.option === '2'){
            this.menuStyle1 = "none";
            this.menuStyle2 = "";
            this.menuStyle3 = "none";
          }
          else if(this.loginInfo.option === '3'){
            this.menuStyle1 = "none";
            this.menuStyle2 = "none";
            this.menuStyle3 = "";
          }
        }
      }
    }
</script>

<style scoped>
  .leftBorder{
    width: 16%;
    min-height: 570px;
    height: 100%;
    padding-top: 63px;
    background-color: #304156;
    float: left;
    position: fixed;
    z-index: 0;
  }
  .left{
    width: 100%;
    height: 100%;
  }
  .child-item .el-menu-item{
    background-color: #1F2D3D!important;
  }
  .child-item .el-menu-item:hover{
    background-color: #001528!important;
  }
  .child-item .el-submenu__title{
    background-color: #1F2D3D!important;
  }
  .child-item .el-submenu__title:hover{
    background-color: #001528!important;
  }
  .child-item .first{
    background-color: #304156!important
  }
</style>
