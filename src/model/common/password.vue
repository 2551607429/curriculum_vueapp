<template>
  <div class="pwd">
    <div class="pwd_form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 600px" class="labelColor">
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model.number="ruleForm.oldPass" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import * as passApi from './api/info'
  export default {
        name: "password",
      data() {
        var validatePass = (rule, value, callback) => {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
        };
        var validatePass2 = (rule, value, callback) => {
          if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          ruleForm: {
            oldPass: '',
            pass: '',
            checkPass: '',
            username: this.$cookieStore.getCookie("username"),
            option: this.$cookieStore.getCookie("option")
          },
          rules: {
            oldPass: [
              { required: true, message: '请输入旧密码', trigger: 'blur' }
            ],
            pass: [
              { required: true, message: '请输入新密码', trigger: 'blur' },
              { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { required: true, message: '请再次输入新密码', trigger: 'blur' },
              { validator: validatePass2, trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              passApi.updatePwd(this.ruleForm).then(res=>{
                if(res.code === 1 || res.code === 400){
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
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style>
  .pwd{
    background-color: #eff3f7;
    margin-top: 3px;
    float: right;
    min-height: 570px;
    width: 78%;
    overflow:auto;
  }
  .pwd_form{
    margin-left: 40px;
    margin-top: 40px;
  }
  .labelColor .el-form-item__label{
    color: #53514b;
  }
</style>
