<template>
  <div class="bg">
    <vue-particles
        color="#fff"
        :particleOpacity="0.7"
        :particlesNumber="100"
        shapeType="circle"
        :particleSize="4"
        linesColor="#fff"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
    </vue-particles>
    <div class="login_border">
      <div>
        <h3 class="title">基于SSM框架的高校课程考核系统欢迎你</h3>
      </div>
      <div class="login">
        <el-form :model="LoginForm"
                   :rules="rules"
                   ref="LoginForm"
                   class="demo-ruleForm">
          <div class="icon_style">
              <i class="el-icon-postcard"></i>
            </div>
          <el-form-item prop="region">
            <el-select v-model="LoginForm.option" style="width: 250px" placeholder="请选择身份">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="icon_style">
            <i class="el-icon-user"></i>
          </div>
          <el-form-item prop="username">
            <el-input type="text" autofocus="true"  ref="username" placeholder="请输入用户名"  v-model="LoginForm.username" clearable></el-input>
          </el-form-item>
          <div class="icon_style">
            <i class="el-icon-lock"></i>
          </div>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码"  v-model="LoginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item prop="verification" style="width: 303px;padding-left: 20px">
            <div class="form-inline-input">
              <div class="code-box" id="code-box">
                <input type="text" name="code" class="code-input" />
                <p></p>
                <span>>>></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submitLogin('LoginForm')"
                       round
                       v-loading.fullscreen.lock="fullscreenLoading"
                       element-loading-text="正在登录中"
            >登录</el-button>
            <el-button type="info" @click="resetLogin('LoginForm')" round>重置</el-button>
          </el-form-item>
        </el-form>
        <div class="register_info">
          <router-link to='/register'>
            <el-link :underline="false" class="register">还没有账号？请立即注册</el-link>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as cmsApi from './api/login';
  export default {
    name: "login",
    data() {
      return {
        options: [{
          value: '1',
          label: '学生'
        }, {
          value: '2',
          label: '教师'
        }, {
          value: '3',
          label: '管理员'
        }],
        LoginForm: {
          username: '',
          password: '',
          option:'1',
          verification: "",
        },
        rules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { pattern: /^\w{6,18}$/, message: '长度在6~18之间，只能包含字母、数字和下划线' }
          ],
          username:[
            { pattern: /^[a-zA-Z]\w{4,15}$/, message: '字母开头，长度为5-16位，允许包含字母数字下划线' },
          ],
          verification:[
            { required: true, message: '请滑动验证码', trigger: 'blur' },
          ]
        },
        fullscreenLoading: false
      };
    },
    created() {
      //回车键直接登录
      let that = this;
      document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        //需要注意的：that.$route.path==''/login'的作用是如果不判断，回车可能所有页面都生效，也就是无论在哪个页面敲回车都会直接登录
        if (that.$route.path=='/login'&& keycode == 13) {
          if(e.path.length == 14 || e.path.length == 4 || e.path.length == 13)
            that.submitLogin('LoginForm');// 登录方法名
          else if(e.path.length == 8)
            this.beforeClose();
          return false;
        }
      };
    },
    mounted(){
      //用户名输入框自动获取焦点
      this.$refs.username.focus();

      var _this = this;
      // window.addEventListener('load',function(){
      //code是后台传入的验证字符串
      var code = "jsaidaisd656",
        codeFn = new _this.moveCode(code,_this);
      // });
    },
    methods:{
      //登录
      submitLogin:function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.fullscreenLoading = true;
            cmsApi.login(this.LoginForm).then(res => {
              if (res.code == 200) {
                this.$cookieStore.setCookie('username',this.LoginForm.username);
                this.$cookieStore.setCookie('option',this.LoginForm.option);
                if (this.LoginForm.option == 1){
                  this.$router.push({
                    path: '/student_index'
                  })
                }
                else if(this.LoginForm.option == 2){
                }
                else if(this.LoginForm.option == 3){
                  this.$router.push({
                    path: '/admin_index'
                  })
                }
              } else {
                this.fullscreenLoading = false;
                this.$alert(res.msg, '提醒', {
                  confirmButtonText: '确定',
                  closeOnPressEscape: 'false',
                  closeOnClickModal: 'true',
                  beforeClose: (action, instance, done) => {
                    done(); // 就是它!
                  }
                });
              }
            })
          }
        });
      },
      resetLogin(formName) {
        this.$refs[formName].resetFields();
      },
      //获取元素距离页面边缘的距离
      getOffset(box,direction){
        var setDirection =  (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
        var offset =  box[setDirection];
        var parentBox = box.offsetParent;
        while(parentBox){
          offset+=parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      },
      moveCode(code,_this){
        var fn = {codeVluae : code};
        var box = document.querySelector("#code-box"),
          progress = box.querySelector("p"),
          codeInput = box.querySelector('.code-input'),
          evenBox = box.querySelector("span");
        //默认事件
        var boxEven = ['mousedown','mousemove','mouseup'];
        //改变手机端与pc事件类型
        if(typeof document.ontouchstart == 'object'){
          boxEven = ['touchstart','touchmove','touchend'];
        }
        var goX,offsetLeft,deviation,evenWidth,endX;
        function moveFn(e){
          e.preventDefault();
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          endX = e.clientX - goX;
          endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
          if(endX > evenWidth * 0.7){
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
          }else{
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
          }
          progress.style.width = endX+deviation+'px';
          evenBox.style.left = endX+'px';
        }
        function removeFn() {
          document.removeEventListener(boxEven['2'],removeFn,false);
          document.removeEventListener(boxEven['1'],moveFn,false);
          if(endX > evenWidth * 0.7){
            progress.innerText = '验证成功';
            progress.style.width = evenWidth+deviation+'px';
            evenBox.style.left = evenWidth+'px'
            codeInput.value = fn.codeVluae;
            evenBox.onmousedown = null;
            _this.LoginForm.verification = true;
          }else{
            progress.style.width = '0px';
            evenBox.style.left = '0px';
          }
        };
        function getOffset(box,direction){
          var setDirection =  (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset =  box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        };
        evenBox.addEventListener(boxEven['0'], function(e) {
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          goX = e.clientX,
            offsetLeft = getOffset(box,'left'),
            deviation = this.clientWidth,
            evenWidth = box.clientWidth - deviation,
            endX;
          document.addEventListener(boxEven['1'],moveFn,false);
          document.addEventListener(boxEven['2'],removeFn,false);
        },false);
        fn.setCode = function(code){
          if(code)
            fn.codeVluae = code;
        }
        fn.getCode = function(){
          return fn.codeVluae;
        }
        fn.resetCode = function(){
          evenBox.removeAttribute('style');
          progress.removeAttribute('style');
          codeInput.value = '';
        };
        return fn;
      }
    }
  }
</script>

<style scoped>
  #particles-js{
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: url("../../assets/image/bg1.jpg");
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    min-width: 1000px;
    z-index:-1;
    zoom: 1;
    background-color: #fff;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
  .bg{
  }
  .title{
    font-family: "Microsoft YaHei UI";
    color: white;
  }
  .login_border{
    border-style: solid;
    border-color: white;
    width: 350px;
    height: 420px;
    border-radius: 30px;
    margin:auto;
    text-align: center;
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index: 0;
  }
  .login{
    margin-top: 27px;
    width: 100%;
    height: 310px;
  }
  .icon_style{
    float: left;
    margin-left: 23px;
    margin-top: 7px;
  }
  .text_style{
    float: right;
    margin-right: 30px;
  }
  .user_style{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .el-icon-user{
    color: white;
    font-size: 1.5em;
  }
  .el-icon-lock{
    color: white;
    font-size: 1.5em;
  }
  .el-icon-postcard{
    color: white;
    font-size: 1.5em;
  }
  .register_info{
    margin-top: 20px;
  }
  .register{
    color: white;
    font-size: 12px;
  }
  .el-input{
    width: 250px;
    float: right;
    padding-right: 26px;
    cursor:pointer;
  }
  .el-input .el-form-item__error{
    width: 230px;
    float: right;
  }
  .el-input__suffix{
    right: 26px;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 296px;
    height: 40px;
    color: #fff;
    text-shadow: 1px 1px 1px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
</style>

