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
    <div class="header">
      <div>
        <el-button type="primary" @click="login" round>
          <i class="el-icon-back"></i>返回登录
        </el-button>
      </div>
    </div>
    <div class="register">
        <div>
          <h2>用户注册</h2>
        </div>
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="100px"  class="demo-ruleForm">
          <el-form-item label="身份" prop="region">
            <el-select v-model="registerForm.option" @change="selectOption" placeholder="请选择身份">
              <el-option popper-class="option"
              v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div id="Form1" v-bind:style="{display: formStyle1}">
            <el-form :model="stuForm" status-icon :rules="rules" ref="stuForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="学号" prop="stuId">
                <el-input type="text" v-model="stuForm.stuId" ref="stuId" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="stuForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="stuForm.pass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="stuForm.checkPass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input type="text" v-model="stuForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="stuForm.gender">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="班级" prop="classId">
                <el-select v-model="stuForm.classId" placeholder="请选择所在班级">
                  <el-option
                    v-for="item in classInfo"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" prop="tel">
                <el-input type="text" v-model="stuForm.tel" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="家庭住址" prop="address">
                <el-input type="text" v-model="stuForm.address" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册码" prop="key">
                <el-input type="text" v-model="stuForm.key" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('stuForm')">注册</el-button>
                <el-button @click="resetForm('stuForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div id="Form2" v-bind:style="{display: formStyle2}">
            <el-form :model="teacherForm" status-icon :rules="rules" ref="teacherForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="教师编号" prop="teachId">
                <el-input type="text" v-model="teacherForm.teacherId" ref="teachId" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="teacherForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="teacherForm.pass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="teacherForm.checkPass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input type="text" v-model="teacherForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="teacherForm.gender">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="学院" prop="collegeId">
                <el-select v-model="teacherForm.collegeId" placeholder="请选择所属学院">
                  <el-option
                    v-for="item in collegeInfo"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话" prop="tel">
                <el-input type="text" v-model="teacherForm.tel" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册码" prop="key">
                <el-input type="text" v-model="teacherForm.key" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('teacherForm')">注册</el-button>
                <el-button @click="resetForm('teacherForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div id="Form3" v-bind:style="{display: formStyle3}">
            <el-form :model="adminForm" status-icon :rules="rules" ref="adminForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="用户名"  prop="username">
                <el-input type="text" v-model="adminForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="adminForm.pass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="adminForm.checkPass" show-password autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input type="text" v-model="adminForm.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册码" prop="key">
                <el-input type="text" v-model="adminForm.key" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('adminForm')">注册</el-button>
                <el-button @click="resetForm('adminForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-form>
      </div>
  </div>
</template>

<script>
    import * as loginApi from './api/login'
    export default {
      name: "register",
      data() {
        //验证用户名是否已注册
        var validateUsername = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'));
            } else {
              var param;
              if(this.registerForm.option === '1'){
                this.stuForm.option = '1';
                param = this.stuForm;
              }
              else if(this.registerForm.option === '2'){
                this.teacherForm.option = '2';
                param = this.teacherForm;
              }
              else if(this.registerForm.option === '3'){
                this.adminForm.option = '3';
                param = this.adminForm;
              }
              loginApi.userNameUnique(param).then(res=>{
                if(res.code === '101'){
                  callback(res.msg);
                }
                else
                  callback();
              });
            }
        };
        //验证教师编号是否已注册
        var validateTeacherId = (rule, value, callback) => {
          this.teacherForm.option = '2';
          loginApi.teacherIdUnique(this.teacherForm).then(res=>{
            if(res.code === '409'){
              callback(res.msg);
            }
            else
              callback();
          });
        };
        //验证两次密码是否一致
        var validatePass2 = (rule, value, callback) => {
          if(this.registerForm.option === '1'){
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.stuForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
          else if(this.registerForm.option === '2'){
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.teacherForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
          else if(this.registerForm.option === '3'){
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.adminForm.pass) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
        };
        //验证注册码是否正确
        var validateKey = (rule, value, callback) => {
          var param;
          if(this.registerForm.option === '1'){
            this.stuForm.option = '1';
            param = this.stuForm;
          }
          else if(this.registerForm.option === '2'){
            this.teacherForm.option = '2';
            param = this.teacherForm;
          }
          else if(this.registerForm.option === '3'){
            this.adminForm.option = '3';
            param = this.adminForm;
          }
          loginApi.checkKey(param).then(res=>{
            if(res.code === '101'){
              callback(res.msg);
            }
            else
              callback();
          });
        };
        return {
          formStyle1: "",
          formStyle2: "none",
          formStyle3: "none",
          options: [{
            value: '1',
            label: '学生'
          },{
            value: '2',
            label: '教师'
          },{
            value: '3',
            label: '管理员'
          }],
          classInfo: [],
          collegeInfo: [],
          registerForm:{
            option:'1',
          },
          stuForm: {
            stuId: '',
            username: '',
            pass: '',
            checkPass: '',
            name: '',
            gender: '男',
            classId: '',
            tel: '',
            address: '',
            key: '',
            option: ''
          },
          teacherForm: {
            teacherId: '',
            username: '',
            pass: '',
            checkPass: '',
            name: '',
            gender: '男',
            collegeId: '',
            tel: '',
            key: '',
            option: ''
          },
          adminForm: {
            username:'',
            pass: '',
            checkPass: '',
            name: '',
            key: '',
            option: ''
          },
          rules: {
            pass: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { pattern: /^\w{6,18}$/, message: '长度在6~18之间，只能包含字母、数字和下划线' }
            ],
            checkPass: [
              { required: true, validator: validatePass2, trigger: 'blur' }
            ],
            stuId: [
              { required: true, message: '请输入学号', trigger: 'blur' },
              { pattern: /^\d{4,16}$/, message: '长度为4-16位，只允许数字' }
            ],
            teacherId: [
              { required: true, pattern: /^\d{4,16}$/, message: '长度为4-16位，只允许数字' },
              { validator: validateTeacherId, trigger: 'blur' }
            ],
            username: [
              { pattern: /^[a-zA-Z]\w{4,15}$/, message: '字母开头，长度为5-16位，允许包含字母数字下划线' },
              { required: true, validator: validateUsername, trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
            ],
            key: [
              { required: true, message: '请输入注册码', trigger: 'blur' },
              { validator: validateKey, trigger: 'blur' }
            ],
            tel: [
              { required: true, pattern: /^1\d{10}$/, message: '请输入正确的电话格式' }
            ],
            address: [
              { required: true, message: '请输入家庭住址', trigger: 'blur' }
            ],
            classId: [
              { required: true, message: '请选择所在班级', trigger: 'change' }
            ],
            collegeId: [
              { required: true, message: '请选择所属学院', trigger: 'change' }
            ]
          }
        };
      },
      created() {
        //回车键直接登录
        let that = this;
        document.onkeypress = function(e) {
          var keycode = document.all ? event.keyCode : e.which;
          //需要注意的：that.$route.path==''/login'的作用是如果不判断，回车可能所有页面都生效，也就是无论在哪个页面敲回车都会直接登录
          if (that.$route.path=='/register'&& keycode == 13) {
            // console.log(e.path.length);
            if(e.path.length == 14 || e.path.length == 4 || e.path.length == 16){
              that.submitForm('stuForm');
              that.submitForm('teacherForm');
              that.submitForm('adminForm');
            }
            else if(e.path.length == 8)
              this.beforeClose();
            return false;
          }
        };
      },
      mounted(){
        //用户名输入框自动获取焦点
        this.$refs.stuId.focus();

        this.createCode();//加载页面时需要触发的函数
      },
      methods: {
        //加载页面时加载的方法
        createCode(){
          loginApi.classInfo().then(res=>{
            for(let i in res){
              this.classInfo.push(res[i]);
            }
          });
          loginApi.collegeInfo().then(res=>{
            for(let i in res){
              this.collegeInfo.push(res[i]);
            }
          })
        },
        //注册提交
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              loginApi.register(this.$refs[formName].model).then(res=>{
                if(res.code == 200){
                  this.$alert(res.msg, '提醒', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({ path: '/login'})
                    }
                  });
                }
                else{
                  this.$alert(res.msg, '提醒', {
                    confirmButtonText: '确定',
                    closeOnPressEscape: 'false',
                    closeOnClickModal: 'true',
                    beforeClose: (action, instance, done) => {
                      done(); // 关闭窗口
                    }
                  });
                }
              });
            } else {
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        selectOption:function () {
          if(this.registerForm.option == '1'){
            this.formStyle1 = "";
            this.formStyle2 = "none";
            this.formStyle3 = "none";
          }
          else if(this.registerForm.option == '2'){
            this.formStyle1 = "none";
            this.formStyle2 = "";
            this.formStyle3 = "none";
          }
          else if(this.registerForm.option == '3'){
            this.formStyle1 = "none";
            this.formStyle2 = "none";
            this.formStyle3 = "";
          }
        },
        login:function () {
          this.$router.push({ path: '/login'})
        }
      }
    }
</script>

<style scoped>
  #particles-js{
    width: 100%;
    height: 900px;
    position: absolute;
    background-color: #005268;
    background-repeat: no-repeat;
    top: 0;
    left: 0;
    min-width: 1000px;
    z-index:-1;
    zoom: 1;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }
  .bg{
    overflow:auto;
  }
  .header{
    #background-color: #B3C0D1;
    color: #333;
    padding-top: 15px;
    padding-left: 50px;
    height: 100px;
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index: 0;
  }
  .register{
    text-align: center;
    width: 500px;
    color: white;
    margin:0 auto;
    position: relative;
  }
  .el-select{
    width: 400px;
  }
  .el-form-item__label{
    color: white;
  }
</style>
