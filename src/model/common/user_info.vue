<template>
  <div class="userInfo">
    <div class="userForm">
      <div id="Form1" v-bind:style="{display: formStyle1}">
        <el-form :model="stuForm" status-icon  ref="stuForm" :rules="rules" label-width="100px" style="width: 600px" class="labelColor">
          <el-form-item label="学号" prop="stuId">
          <el-input type="text" v-model="stuForm.stuId" ref="stuId" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="stuForm.username" :disabled="true" autocomplete="off"></el-input>
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
                v-for="item in classinfo"
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
          <el-form-item>
            <el-button type="primary" @click="saveForm('stuForm')">保存信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="Form2" v-bind:style="{display: formStyle2}">
        <el-form :model="teacherForm" status-icon :rules="rules" ref="teacherForm" label-width="100px" style="width: 600px" class="labelColor">
          <el-form-item label="教师编号" prop="teachId">
            <el-input type="text" v-model="teacherForm.teacherId" ref="teachId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="teacherForm.username" :disabled="true" autocomplete="off"></el-input>
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
                v-for="item in collegeinfo"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="tel">
            <el-input type="text" v-model="teacherForm.tel" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveForm('teacherForm')">保存信息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="Form3" v-bind:style="{display: formStyle3}">
        <el-form :model="adminForm" status-icon :rules="rules" ref="adminForm" label-width="100px" style="width: 600px" class="labelColor">
          <el-form-item label="用户名"  prop="username">
            <el-input type="text" v-model="adminForm.username" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input type="text" v-model="adminForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveForm('adminForm')">保存信息</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import * as infoApi from './api/info'
  import * as loginApi from "../home/api/login";
    export default {
      name: "user_info",
      data(){
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
        return{
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
          classinfo: [],
          collegeinfo: [],
          registerForm:{
            option:'1',
          },
          loginInfo:{
            username: this.$cookieStore.getCookie("username"),
            option: this.$cookieStore.getCookie("option")
          },
          stuForm: {
            stuId: '',
            username: '',
            pass: '',
            name: '',
            gender: '',
            classId: '',
            tel: '',
            address: '',
            option: this.$cookieStore.getCookie("option")
          },
          teacherForm: {
            teacherId: '',
            username: '',
            pass: '',
            name: '',
            gender: '男',
            collegeId: '',
            tel: '',
            option: this.$cookieStore.getCookie("option")
          },
          adminForm: {
            username:'',
            pass: '',
            name: '',
            option: this.$cookieStore.getCookie("option")
          },
          rules: {
            stuId: [
              { required: true, message: '请输入学号', trigger: 'blur' },
              { pattern: /^\d{4,16}$/, message: '长度为4-16位，只允许数字' }
            ],
            teacherId: [
              { required: true, pattern: /^\d{4,16}$/, message: '长度为4-16位，只允许数字' },
              { validator: validateTeacherId, trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' }
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
        }
      },
      mounted(){
          this.userInit();
      },
      methods:{
        //初始化用户信息
        userInit:function () {
          //获取班级数据
          loginApi.classInfo().then(res=>{
            for(let i in res){
              this.classinfo.push(res[i]);
            }
          });
          // 获取学院数据
          loginApi.collegeInfo().then(res=>{
            for(let i in res){
              this.collegeinfo.push(res[i]);
            }
          });
          //获取用户信息
          infoApi.userInfo(this.loginInfo).then(res=>{
            if(this.loginInfo.option === '1'){
              this.formStyle1 = "";
              this.formStyle2 = "none";
              this.formStyle3 = "none";

              this.stuForm.stuId = res.stuId;
              this.stuForm.username = res.username;
              this.stuForm.pass = res.pass;
              this.stuForm.name = res.name;
              this.stuForm.gender = res.gender;
              this.stuForm.classId = res.classId;
              this.stuForm.tel = res.tel;
              this.stuForm.address = res.address;
            }
            else if(this.loginInfo.option === '2'){
              this.formStyle1 = "none";
              this.formStyle2 = "";
              this.formStyle3 = "none";

              this.teacherForm.teacherId = res.teacherId;
              this.teacherForm.username = res.username;
              this.teacherForm.pass = res.pass;
              this.teacherForm.name = res.name;
              this.teacherForm.gender = res.gender;
              this.teacherForm.collegeId = res.collegeId;
              this.teacherForm.tel = res.tel;
              this.teacherForm.address = res.address;
            }
            else if(this.loginInfo.option === '3'){
              this.formStyle1 = "none";
              this.formStyle2 = "none";
              this.formStyle3 = "";

              this.adminForm.username = res.username;
              this.adminForm.pass = res.pass;
              this.adminForm.name = res.name;
            }
          });
        },
        //保存修改
        saveForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              infoApi.updateUserInfo(this.$refs[formName].model).then(res=>{
                if(res.code === 1){
                  this.$alert(res.msg, '提醒', {
                    confirmButtonText: '确定'
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
        }
      }
    }
</script>

<style>
  .userInfo{
    background-color: #eff3f7;
    margin-top: 3px;
    float: right;
    min-height: 570px;
    width: 78%;
    overflow:auto;
  }
  .userForm{
    margin-left: 40px;
    margin-top: 40px;
  }
  .labelColor .el-form-item__label{
    color: #53514b;
  }
</style>
