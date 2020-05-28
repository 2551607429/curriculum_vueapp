<template>
  <div class="studentIndex">
    <div class="function">
      学习知识
      <div class="fun1">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="hover" @click.native="cardClick(1)">
              <i class="el-icon-s-order"></i>
              已选课程
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" @click.native="cardClick(2)">
              <i class="el-icon-collection"></i>
              学习课程知识
            </el-card>
          </el-col>
        </el-row>
      </div>
      课程考核
      <div class="fun2">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="hover" @click.native="cardClick(3)">
              <i class="el-icon-tickets"></i>
              参加考核
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" @click.native="cardClick(4)">
              <i class="el-icon-notebook-2"></i>
              查看考核信息
            </el-card>
          </el-col>
        </el-row>
      </div>
      当前正在进行的考试
      <div class="exam">
      </div>
    </div>
  </div>
</template>

<script>

    export default {
      name: "student_index",
      data() {
        return {
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          }
        }
      },
      methods: {
        cardClick(flag) {
          switch (flag) {
            case 1: this.$router.push({ path: '/' });  break;
            case 2: this.$router.push({ path: '/' });  break;
            case 3: this.$router.push({ path: '/exam_list' });  break;
            case 4: this.$router.push({ path: '/exam_score' });  break;
          }
        }
      }
    }
</script>

<style scoped>
  .studentIndex{
    background-color: #e3e3e3;
    margin-top: 60px;
    float: right;
    min-height: 580px;
    width: 84%;
    overflow:auto;
    z-index: -1;
  }
  .function{
    padding: 40px 0 0 60px;
  }
  .fun1{
    margin-top: 5px;
    padding-bottom: 30px;
    padding-top: 10px;
    border-top: solid #ACC0D8 1px;
  }
  .fun2{
    margin-top: 5px;
    padding-bottom: 30px;
    padding-top: 10px;
    border-top: solid #ACC0D8 1px;
  }
  .exam{
    margin-top: 5px;
    padding-top: 10px;
    border-top: solid #ACC0D8 1px;
  }
  .el-col{
    margin-right: 40px;
    cursor:pointer;
  }
  .home_banner{position:relative;width:100%;height:620px;color:#fff;background:url("../../assets/image/banner.png") no-repeat center center;background-size:cover}

</style>
