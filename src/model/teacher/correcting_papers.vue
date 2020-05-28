<template>
  <div class="stuExam">
    <div class="stuExamHead">
      <span>{{examName}}</span>
    </div>
    <div class="stuExamRight">
      <el-button type="primary" @click="submitCorrectPaper(examData)">提交阅卷</el-button>
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
              <div class="score">
                <el-radio-group @change="resultRadio(item,index)" v-model="item.result"  size="small">
                  <el-radio-button label="1"> √ </el-radio-button>
                  <el-radio-button label="0"> × </el-radio-button>
                </el-radio-group>
                <el-input-number
                  @change="inputChange"
                  :controls="false"
                  v-model="item.stuScore"
                  :min="0"
                  :max=item.score
                  label="描述文字"
                  size="small">
                </el-input-number>
                分
              </div>
            </div>
            <!--          当是选择题时-->
            <div v-if="item.typeId === 1" class="answer">
              <el-radio-group v-model="item.stuAnswer" :disabled="true">
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
                  :disabled="true"
                  v-model="item.checkList[index]"
                  style="width:400px"
                  placeholder="请输入内容">
                </el-input>
              </div>
            </div>
            <!--          当是判断题时-->
            <div v-else-if="item.typeId === 3" class="answer">
              <el-radio-group v-model="item.stuAnswer" :disabled="true">
                <el-radio class="option" label="对">√ 正 确</el-radio><br>
                <el-radio class="option" label="错">× 错 误</el-radio>
              </el-radio-group>
            </div>
            <!--          当是简答题 或 计算题 或综合题时-->
            <div v-else-if="item.typeId === 4 || item.typeId === 6 || item.typeId === 8" class="answer">
              <el-input
                :disabled="true"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="item.stuAnswer"
                style="width:400px"
                placeholder="请输入内容">
              </el-input>
            </div>
            <!--          当是多选题时-->
            <div v-else-if="item.typeId === 5" class="answer">
              <el-checkbox-group v-model="item.checkList" :disabled="true">
                <el-checkbox class="option" label="A">{{item.optionA}}</el-checkbox><br>
                <el-checkbox class="option" label="B">{{item.optionB}}</el-checkbox><br>
                <el-checkbox class="option" label="C">{{item.optionC}}</el-checkbox><br>
                <el-checkbox class="option" label="D">{{item.optionD}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--          当是其它题型时-->
            <div v-else class="answer">
              <el-input
                :disabled="true"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="item.stuAnswer"
                style="width:400px"
                placeholder="请输入内容">
              </el-input>
            </div>
            <div class="answer">
              <p>学生答案：
                <span :class="item.stuScore === item.score ? 'answerTrue' : 'answerFalse'">
                  {{item.stuAnswer}}
                </span>
              </p>
              <p>正确答案：{{item.answer}}</p>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="stuExamLeft">
      班级<br>
      <span class="info">{{className}}</span>
      <el-divider></el-divider>
      姓名<br>
      <span class="info">{{name}}</span>
      <el-divider></el-divider>
      学号<br>
      <span class="info">{{studentId}}</span>
      <el-divider></el-divider>
      考试成绩<br>
      <span :class="stuTotalScore &gt;= totalScore * 0.6 ? 'info' : 'unqualified'">{{stuTotalScore}}</span>
    </div>
  </div>
</template>

<script>
  import * as correctPaperApi from "./api/manage";
    export default {
      name: "correcting_papers",
      data() {
        return{
          examForm: {

          },
          content: '',
          name: '',
          studentId: '',
          className: '',
          stuTotalScore: '',
          totalScore: '',
          checkList: [],
          examData: [],
          examName: '',
          examEndTime: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            id: this.$cookieStore.getCookie('examId'),
            stuId: this.$cookieStore.getCookie('stuId')
          },
          formLabelWidth: '140px',
        }
      },
      created(){
        this.paperInit(this.page,this.pageSize);
      },
      methods:{
        //初始化试卷信息
        paperInit(){
          correctPaperApi.paperInit(this.userInfo).then(res=>{
            for(let i in res){
              this.examData.push(res[i]);
            }
            console.log(res);
            this.examName = res[0].examName;
            this.className = res[0].className;
            this.name = res[0].name;
            this.studentId = res[0].studentId;
            this.stuTotalScore = res[0].stuTotalScore;
            this.totalScore = res[0].totalScore;
          });
        },
        resultRadio(item,index){
          if(item.result === '0'){
            this.examData[index].stuScore = 0;
          }
          else{
            this.examData[index].stuScore = item.score;
          }
          let total = 0;
          for(let value in this.examData){
            total += this.examData[value].stuScore;
          }
          this.stuTotalScore = total;
        },
        inputChange(){
          let total = 0;
          for(let value in this.examData){
            total += this.examData[value].stuScore;
          }
          this.stuTotalScore = total;
        },
        submitCorrectPaper(formName){
          this.$confirm('确定要提交阅卷吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            correctPaperApi.submitCorrectPaper(formName).then(res=>{
              this.$message({
                type: res.code === '200' ? 'success' : 'error',
                message: res.msg
              });
              this.$router.push({ path: '/exam_student' });
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
</script>

<style >
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
    height: 300px;
    position: fixed;
    color: #27274A;
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
  .score{
    float: right;
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
  .answerTrue{
    color: #1a8cfe;
  }
  .answerFalse{
    color: #ff0000;
  }
  .info{
    color: #1a8cfe;
    line-height: 35px;
  }
  /*不合格*/
  .unqualified{
    color: #ff0000;
    line-height: 35px;
  }
  .el-divider--horizontal{
    margin: 10px 0;
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
