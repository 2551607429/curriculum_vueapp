<template>
  <div class="examListManage">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 考试学生列表</span>
          <div class="notice">
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="400"
              :data="tableData"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              @row-click="rowClickSelection"
            >
              <el-table-column
                :formatter="formatter"
                type="selection"
                width="50">
              </el-table-column>
              <template v-for="(item, index) in columns">
                <el-table-column
                  :prop="item.prop"
                  :key="index"
                  align="center"
                  :width="item.width"
                  :label="item.label"
                  v-if="item.show"
                  :show-overflow-tooltip="item.overflow"
                  :filters="item.filters"
                  :filter-method="item.filterMethod"
                  :formatter="item.formatter"
                  :sortable="item.sortable"
                >
                </el-table-column>
              </template>
              <el-table-column
                fixed="right"
                label="操作"
                style="z-index: 0"
                width="200">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click.native.prevent="correct(scope.$index, tableData)"
                  > 批改试卷
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="sizeChange"
              @current-change="switchPage"
              :current-page="currentPage"
              :page-sizes="[50, 100, 200, 400, total]"
              :page-size=pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total=total>
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import * as examStudentApi from "./api/manage";
    export default {
      name: "exam_student",
      data() {
        return {
          columns:[
            {prop:'examName',label:'考试名称',width:'220',show:true},
            {prop:'className',label:'班级名称',width:'140',show:true},
            {prop:'username',label:'用户名',width:'140',show:true},
            {prop:'name',label:'姓名',width:'140',show:true},
            {prop:'score',label:'分数',width:'100',show:true}
          ],
          nowTime: '',
          tableData: [],
          selectIndex: '',
          multipleSelection: [],
          search: '',
          typeInfo: [],
          classInfo: [],
          curriculumInfo: [],
          questionCountInfo: [],
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            key: this.$cookieStore.getCookie('examId')
          },
          examListManageInfo:{
            id: [],
            curriculum: '',
            option: this.$cookieStore.getCookie('option'),
            username: this.$cookieStore.getCookie('username')
          },
          formLabelWidth: '140px',
          dialogFormVisible: false,
          loading: true,
          total: 0,
          page:1,
          pageSize:50,
          currentPage: 1,
        }
      },
      created(){
        this.examStudentInit(this.page,this.pageSize);
        this.getTime();
      },
      methods: {
        //获取当前时间
        getTime(){
          setInterval(()=>{
            //new Date() new一个data对象，当前日期和时间
            //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
            this.nowTime = new Date().getTime();
          },1000)
        },
        // 时间戳转换成时间（开始时间）
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTime (row, column) {
          var date = new Date(row.startTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
          return Y+M+D+h+m+s;
        },
        // 时间戳转换成时间（结束时间）
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTimeEnd (row, column) {
          var date = new Date(row.endTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
          return Y+M+D+h+m+s;
        },
        // 时间戳转换成时间（通用）
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTimeAll (timestamp) {
          var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
          return Y+M+D+h+m+s;
        },
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //获取学生考试列表
        examStudentInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          examStudentApi.examStudentInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
        },
        //批改试卷
        correct(index, rows){
          this.$cookieStore.setCookie('stuId',rows[index].studentId);
          this.$router.push({
            path: '/correcting_papers'
          });
        },
        // 取消选择
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        //点击行
        rowClickSelection(row,column,event){
          if (row) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        },
        //当每页数量发生改变时
        sizeChange(val){
          this.loading = true;
          this.tableData = [];
          this.pageSize = val;
          this.examListManageInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.examListManageInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .examListManage{
    background-color: #e3e3e3;
    margin-top: 60px;
    float: right;
    min-height: 580px;
    width: 84%;
    overflow:auto;
    z-index: -1;
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
