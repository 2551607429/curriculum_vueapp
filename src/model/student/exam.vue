<template>
  <div class="stuExam">
    <div class="stuExamHead">
      <span>{{examName}}</span>
    </div>
    <div class="stuExamRight">
      <el-button type="primary" @click="submitPaper('addForm')">提交试卷</el-button>
    </div>
    <div class="stuExamForm">
      <el-form
        :model="examForm"
        status-icon ref="addForm"
        :label-width="formLabelWidth"
        class="labelColor">
        <div v-for="(item,index) in examData">
          <div v-if="index === 0 || item.typeId !== examData[index-1].typeId" class="questionType">
              {{item.typeName}} (每题{{item.score}}分)
          </div>
          <div class="questions-content">
            <div class="exam-question">
              {{index + 1}}. {{item.stem}}
            </div>
            <!--          当是选择题时-->
            <div v-if="item.typeId === 1" class="answer">
              <el-radio-group v-model="item.stuAnswer">
                <el-radio class="option" label="A">{{item.optionA}}</el-radio><br>
                <el-radio class="option" label="B">{{item.optionB}}</el-radio><br>
                <el-radio class="option" label="C">{{item.optionC}}</el-radio><br>
                <el-radio class="option" label="D">{{item.optionD}}</el-radio>
              </el-radio-group>
            </div>
            <!--          当是填空题或程序填空题时-->
            <div v-else-if="item.typeId === 2 || item.typeId === 7" class="answer">
              <div v-for="(list,index) in item.answerList" class="filled">
                <el-input
                  v-model="item.stuAnswer"
                  style="width:400px"
                  placeholder="请输入内容">
                </el-input>
              </div>
            </div>
            <!--          当是判断题时-->
            <div v-else-if="item.typeId === 3" class="answer">
              <el-radio-group v-model="item.stuAnswer">
                <el-radio class="option" label="对">√ 正 确</el-radio><br>
                <el-radio class="option" label="错">× 错 误</el-radio>
              </el-radio-group>
            </div>
            <!--          当是简答题 或 计算题 或综合题时-->
            <div v-else-if="item.typeId === 4 || item.typeId === 6 || item.typeId === 8" class="answer">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="item.stuAnswer"
                style="width:400px"
                placeholder="请输入内容">
              </el-input>
            </div>
            <!--          当是多选题时-->
            <div v-else-if="item.typeId === 5" class="answer">
                <el-checkbox class="option" label="A">{{item.optionA}}</el-checkbox><br>
                <el-checkbox class="option" label="B">{{item.optionB}}</el-checkbox><br>
                <el-checkbox class="option" label="C">{{item.optionC}}</el-checkbox><br>
                <el-checkbox class="option" label="D">{{item.optionD}}</el-checkbox>
            </div>
            <!--          当是其它题型时-->
            <div v-else class="answer">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="item.stuAnswer"
                style="width:400px"
                placeholder="请输入内容">
              </el-input>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="stuExamLeft">
      剩余时间<br>
      <span class="time" :endTime="endTime" :callback="callback" :endText="endText">
        <slot>
            {{content}}
        </slot>
      </span>
    </div>
  </div>
</template>

<script>
    import * as examApi from "./api/assess";
    export default {
      name: "exam",
      data(){
        return{
          examForm: {

          },
          content: '',
          nowTime: '',
          examData: [],
          examName: '',
          examEndTime: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            id: this.$cookieStore.getCookie('examId'),
          },
          formLabelWidth: '140px',
        }
      },
      props:{
        endTime:{
          type: String,
          default :this.examEndTime
        },
        endText:{
          type : String,
          default:'已结束'
        },
        callback : {
          type : Function,
          default :this.stuExamText
        }
      },
      created(){
        this.examInit();
      },
      mounted () {
        var that = this;
        setTimeout(function () {
          that.countDowm(that.examEndTime);
        },3000);
      },
      methods:{
        //初始化题型信息
        examInit(){
          examApi.paperInit(this.userInfo).then(res=>{
            for(let i in res){
              this.examData.push(res[i]);
            }
            this.examName = res[0].examName;
            this.examEndTime = res[0].endTime;
          });
        },
        countDowm(timestamp){
          let self = this;
          let timer = setInterval(function(){
            let nowTime = new Date();
            let endTime = new Date(timestamp);
            let t = endTime.getTime() - nowTime.getTime();
            if(t>0){
              let day = Math.floor(t/86400000);
              let hour=Math.floor((t/3600000)%24);
              let min=Math.floor((t/60000)%60);
              let sec=Math.floor((t/1000)%60);
              hour = hour < 10 ? "0" + hour : hour;
              min = min < 10 ? "0" + min : min;
              sec = sec < 10 ? "0" + sec : sec;
              let format = '';
              if(day > 0){
                format =  `${day}h ${hour}:${min}:${sec}`;
              }
              if(day <= 0 && hour > 0 ){
                format = `${hour}:${min}:${sec}`;
              }
              if(day <= 0 && hour <= 0){
                format =`00:${min}:${sec}`;
              }
              self.content = format;
            }else{
              clearInterval(timer);
              self.content = self.endText;
              self._callback();
            }
          },1000);
        },
        _callback(){
          if(this.callback && this.callback instanceof Function){
            this.callback(...this);
          }
          console.log('123');
        },
        stuExamText(){
          console.log('123');
        },
        submitPaper(formName){
          let nowTime = new Date();
          let endTime = new Date(this.examEndTime);
          let t = endTime.getTime() - nowTime.getTime();
          if(t > 0){
            this.$confirm('考试时间尚未结束, 是否继续交卷?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '交卷成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消交卷'
              });
            });
          }
        }
      }
    }
</script>

<style>
  .stuExam{
    background-color: #f5f7fa;
    padding-top: 60px;
    min-height: 580px;
    width: 100%;
    overflow:auto;
    z-index: -1;
  }
  .stuExamHead{
    width: 100%;
    font-size: 20px;
    line-height: 60px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    text-align: center;
  }
  .stuExamForm{
    float: right;
    border: 1px solid #DEDEDE;
    background-color: white;
    width: 70%;
    margin-right: 15%;
  }
  .stuExamLeft{
    width: 10%;
    margin-top: 70px;
    margin-left: 30px;
    padding-top: 10px;
    height: 80px;
    position: fixed;
    color: #27274A;
    line-height: 20px;
    background: #FFFFFF;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;
    text-align: center;
  }
  .stuExamRight{
    position: fixed;
    margin-top: 30%;
    margin-left: 88%;
    width: 10%;
    float: right;
  }
  .questionType{
    font-size: 18px;
    line-height: 25px;
    padding: 18px 20px;
    background: #FAFAFA;
    border-bottom: 1px solid #DEDEDE;
    border-top: 1px solid #DEDEDE;
    text-shadow: 0 0 black;
  }
  .questions-content {
    width: 80%;
    padding: 30px 0;
    position: relative;
    border-bottom: 1px solid #DEDEDE;
  }
  .exam-question{
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }
  .answer{
    padding-left: 30px;
    padding-right: 75px;
  }
  .filled{
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 20px;
  }
  .option{
    padding: 10px 15px 10px 45px;
  }
  .time{
    color: red;
    line-height: 40px;
  }
  .el-tabs__header{
    z-index: 0;
  }
  .el-table{
    z-index: 0;
  }
  .el-tab-pane{
    margin-left: 10px;
    margin-top: 10px;
  }
  .labelColor .el-form-item__label{
    color: #53514b;
  }
  .template{
    color: cadetblue;
    font-size: 12px;
  }
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
</style>
