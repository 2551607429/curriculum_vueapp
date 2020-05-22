<template>
  <div class="head">
    <div class="left">
      基于SSM框架的高校课程考核系统欢迎你
    </div>
    <div class="right">
      <el-badge class="item">
        <div class="van-info">{{ noticeNumber }}</div>
        <el-button icon="el-icon-message-solid" @click="noticeInfo" size="small">公告</el-button>
      </el-badge>
      <div class="user">
        <el-dropdown  @command="handleCommand">
        <span class="el-dropdown-link">
          <div style="float: left">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
          </div>
          <label class="username">{{Info.username}}</label>
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info" class="clearfix">
              <i class="el-icon-edit-outline"></i>
              用户信息
            </el-dropdown-item>
            <el-dropdown-item command="pass" class="clearfix">
              <i class="el-icon-lock"></i>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="exit" divided class="clearfix">
              <i class="el-icon-switch-button"></i>
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import * as HeadApi from "../home/api/head"
  import util from '../base/api/util'
    export default {
      name: "head-com",
      created:function(){
        //将loadHead()方法设置为公共的函数
        util.$on('noticeState',(noticeState)=>{
          this.loadHead();
        });
        this.loadHead();//加载页面时需要触发的函数
      },
      inject: ['reload'],
      data() {
        return {
          noticeNumber: '',
          name:"head-com",
          Info:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option')
          }
        }
      },
      methods: {
        loadHead:function(){
          HeadApi.noticeCount(this.Info).then(res=>{
            this.noticeNumber = res;
          })
        },
        handleCommand(command) {
          if(command === "exit")
            this.$router.push({ path: '/login'});
          else if(command === "info")
            this.$router.push({ path: '/user_info'});
          else if(command === "pass")
            this.$router.push({ path: '/password'});
        },
        noticeInfo:function () {
          this.$router.push({
            path: '/notice_info'
          })
        }
      }
    }
</script>

<style scoped>
  .head{
    box-shadow:0px 1px 8px 0px rgba(0,0,0,0.12), 0px 1px 0px 0px rgba(232,232,232,1);
    height: 60px;
    width: 100%;
    position: fixed;
    z-index: 2;
    background-color: white;
  }
  .left{
    font-family: "Microsoft YaHei";
    float: left;
    padding: 20px 0 0 24px;
  }
  .right{
    float: right;
    line-height: 56px;
  }
  .el-icon-message-solid{
    color: #847f71;
    font-size: 1.5em;
    padding-right: 15px;
  }
  .user{
    float: right;
    line-height: 40px;
    margin-top: 7px;
    height: 40px;
    border: 1px solid #b8b2a0;
    border-radius: 30px;
    cursor:pointer;
    margin-right: 20px;
  }
  .username{
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    vertical-align:middle;
    display:inline-block;
    cursor:pointer;
  }
  .item {
    margin-right: 20px;
  }
  .el-button--primary {
    width: 36px;
    padding: 10px;
  }
  .el-dropdown {
    display: BLOCK;
  }
  .van-info{
    top: 12px;
  }
</style>
