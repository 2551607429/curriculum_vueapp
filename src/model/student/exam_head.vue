<template>
  <div class="head">
    <div class="left">
      基于SSM框架的高校课程考核系统欢迎你
    </div>
    <div class="right">
      <div class="user">
        <div style="float: left">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
        </div>
        <label class="username">{{Info.username}}</label>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "exam_head",
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
    }
</script>

<style scoped>
  .head{
    box-shadow:0px 1px 8px 0px rgba(0,0,0,0.12), 0px 1px 0px 0px rgba(232,232,232,1);
    height: 60px;
    width: 100%;
    position: fixed;
    z-index: 1;
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
