<template>
  <div class="exam">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 考试详情</span>
          <div class="notice">
            <div style="margin-bottom: 10px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的考试信息"
                style="width: 200px;float: right;margin-right: 100px;cursor: pointer"/>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="400"
              :data="tableData.filter(data => !search || data.teacherName.toLowerCase().includes(search.toLowerCase())
              || data.curriculumName.toLowerCase().includes(search.toLowerCase())
              || data.className.toLowerCase().includes(search.toLowerCase()))"
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
                    @click.native.prevent="editForm(scope.$index, tableData)"
                  > 编辑
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                  > 删除
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
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document-add"></i> 增加考试</span>
          <el-form :model="addForm" status-icon ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="考试名称" :rules="rules.name" prop="name">
              <el-input type="text" style="width: 500px" v-model="addForm.name" placeholder="请输入考试名称"></el-input>
            </el-form-item>
            <el-form-item label="考试时间范围" :rules="rules.examDate" prop="examDate">
              <el-date-picker
                style="width: 500px"
                v-model="addForm.examTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="课程" :rules="rules.curriculumId" prop="curriculumId">
              <el-select v-model="addForm.curriculumId" filterable
                         placeholder="请选择考试课程" @change="questionCountType">
                <el-option
                  v-for="item in curriculumInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="参加考试学生范围" :rules="rules.examRange" prop="examRange">
                  <el-select v-model="addForm.examRange" style="width: 200px" filterable placeholder="请选择参加考试范围">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="班级" v-if="addForm.examRange === '2'" :rules="rules.classIdRange" prop="classIdRange">
                  <el-select v-model="addForm.classIdRange" multiple style="width: 200px" filterable placeholder="请选择考试班级">
                    <el-option
                      v-for="item in classInfo"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-for="(item,index) in addForm.typeList">
              <el-row>
                <el-col :span="2">
                  <el-form-item label="考试题型：" prop="typeId">
                    <el-select v-model="item.typeId" style="width: 200px" placeholder="请选择" @change="countType(item, index)" >
                      <el-option v-for="option in typeInfo" :key="option.id" :label="option.name" :value="option.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item>
                    <el-button type="text" style="margin-left:190px"  @click="deleteItems(item, index)" icon="el-icon-delete" v-show="index>0" >删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="每题分数：" :prop="'typeList.'+index +'.score'" :rules="rules.score">
                    <el-input-number  :min="1" @change="examTotal" style="width: 200px" v-model="item.score"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数量：" :prop="'typeList.'+index +'.count'" :rules="rules.count">
                    <el-input-number  :min="0" @change="examTotal" style="width: 200px" :max="item.maxCount" v-model="item.count"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-form-item>
              <el-button type="text" @click="addItem" style="position: relative;left:120px"><i class="el-icon-circle-plus"></i>新增题型</el-button>
            </el-form-item>
            <el-form-item label="总分：" prop="totalScore" :rules="rules.totalScore">
              <el-input style="width: 200px" disabled v-model="addForm.totalScore"></el-input>
            </el-form-item>
            <el-form-item label="考试难度：" prop="difficulty" :rules="rules.difficulty">
              <el-rate
                v-model="addForm.difficulty"
                :colors="colors"
                :texts="texts"
                show-text>
              </el-rate>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addExam('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改考试信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable" :rules="rules" class="labelColor" ref="editTable" :label-width="formLabelWidth">
        <el-form-item label="考试名称" :rules="rules.name" prop="name">
          <el-input type="text" style="width: 500px" v-model="editTable.name" placeholder="请输入考试名称"></el-input>
        </el-form-item>
        <el-form-item label="考试时间范围" :rules="rules.examDate" prop="examDate">
          <el-date-picker
            style="width: 500px"
            v-model="editTable.examTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRow('editTable')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import waves from '@/directive/waves'
    import * as examApi from "./api/manage";
    import * as manageApi from "../admin/api/manage";
    import * as loginApi from "../home/api/login";

    export default {
      name: "exam_manage",
      directives: { waves },
      data() {
        return {
          columns:[
            {prop:'name',label:'考试姓名',width:'100',show:true},
            {prop:'startTime',label:'开始时间',width:'120',show:true,formatter:this.timestampToTime},
            {prop:'endTime',label:'结束时间',width:'120',show:true,formatter:this.timestampToTimeEnd},
            {prop:'totalScore',label:'总分',width:'60',show:true},
            {prop:'examRange',label:'考试范围',width:'100',show:true},
            {prop:'classNameRange',label:'参加班级',width:'160',show:true},
            {prop:'curriculumName',label:'课程名称',width:'120',show:true},
          ],
          options: [{
            id: '1',
            name: '全部任课学生'
          }, {
            id: '2',
            name: '选择指定班级'
          }],
          failData: [],
          tableData: [],
          editTable: {
            id: '',
            name: '',
            totalScore: '',
            difficulty: '',
            examRange: '',
            classRange: '',
            curriculumId: '',
            examTime: [],
          },
          selectIndex: '',
          // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
          colors: ['#99A9BF', '#F7BA2A', '#FF0000'],
          texts: ['简单', '简单', '中等', '难', '难'],
          addForm: {
            name: '',
            totalScore: '',
            difficulty: null,
            examRange: '',
            classIdRange: [],
            curriculumId: '',
            questionType:'',
            typeList:[{
              typeId:1,
              count:0,
              score:0,
              maxCount: 0
            }],
            examTime: '',
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
          },
          multipleSelection: [],
          search: '',
          typeInfo: [],
          classInfo: [],
          curriculumInfo: [],
          questionCountInfo: [],
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          examInfo:{
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
          downloadLoading: false,
          tableHeader: [],
          allCount: 0,
          successCount: 0,
          failCount: 0,
          rules: {
            name: [
              { required: true, message: '请选择考试名称', trigger: 'blur' }
            ],
            curriculumId: [
              { required: true, message: '请选择考试课程', trigger: 'change' }
            ],
            examRange: [
              { required: true, message: '请选择考试范围', trigger: 'change' }
            ],
            classIdRange: [
              { required: true, message: '请选择班级范围', trigger: 'change' }
            ],
            examTime: [
              { required: true, message: '请选择考试日期', trigger: 'change' }
            ],
            typeId: [
              { required: true, message: '请选择考试题型', trigger: 'blur' }
            ],
            score:[
              { required: true, message: '请输入每题分数'},
            ],
            difficulty:[
              { required: true, message: '请选择难度'},
            ],
            count:[
              { required: true, message: '请输入每题数量'},
              { type: 'integer', message: '数量必须为整数'}
            ],
            totalScore:[
              { required: true, message: '总分不能为空，请选择题型与数量'},
              { type: 'integer', min:1, message: '总分必须为整数且大于0'}
            ],
          }
        }
      },
      created(){
        this.examInit(this.page,this.pageSize);
      },
      methods: {
        //筛选课程
        filterCurriculum(value, row) {
          return row.curriculumName === value;
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
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化题型信息
        examInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          examApi.examInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
          //获取课程信息
          examApi.curriculumInfo(this.userInfo).then(res=>{
            this.curriculumInfo = [];
            for(let i in res){
              this.curriculumInfo.push(res[i]);
            }
          });
          //获取班级信息
          examApi.classInfo(this.userInfo).then(res=>{
            this.classInfo = [];
            for(let i in res){
              this.classInfo.push(res[i]);
            }
          });
          //获取题型信息
          examApi.typeInfo(this.userInfo).then(res=>{
            this.typeInfo = [];
            for(let i in res){
              this.typeInfo.push(res[i]);
            }
          });
        },
        /*动态新增表单项*/
        addItem(){
          this.addForm.typeList.push({
            typeId:1,
            count:0,
            score:0,
            maxCount: this.questionCountInfo[0]
          })
        },
        /*删除新增的表单项*/
        deleteItems(item, index) {
          this.index = this.addForm.typeList.indexOf(item);
          if (index !== -1) {
            this.addForm.typeList.splice(index, 1)
          }
          this.examTotal();
        },
        //通过班级编号查询班级名称
        classByName(id){
          for(let col in this.classInfo){
            if(this.classInfo[col].id === id){
              return this.classInfo[col].name;
            }
          }
        },
        //计算试卷总分
        examTotal(){
          var total = 0;
          for(let i in this.addForm.typeList){
            total += this.addForm.typeList[i].count * this.addForm.typeList[i].score;
          }
          this.addForm.totalScore = total;
        },
        //通过课程编号查询课程名称
        curriculumByName(id){
          for(let col in this.curriculumInfo){
            if(this.curriculumInfo[col].id === id){
              return this.curriculumInfo[col].name;
            }
          }
        },
        //通过题型编号查询该课程的该题型编号的 题目数量
        countType(item, index){
          this.addForm.typeList[index].maxCount = this.questionCountInfo[item.typeId-1];
          this.addForm.typeList[index].count = 0;
        },
        //通过课程编号查询各题型数量和该课程所有班级
        questionCountType(id){
          this.examInfo.curriculum = id;
          //获取题型信息
          examApi.questionCountType(this.examInfo).then(res=>{
            this.questionCountInfo = [];
            for(let i in res){
              this.questionCountInfo.push(res[i]);
            }
            this.addForm.typeList[0].maxCount =  this.questionCountInfo[0];
            for(let i in this.addForm.typeList){
              this.addForm.typeList[i].count = 0;
              this.addForm.typeList[i].score = 0;
            }
            this.examTotal();
          });
          //获取班级信息
          examApi.classInfo(this.examInfo).then(res=>{
            this.classInfo = [];
            for(let i in res){
              this.classInfo.push(res[i]);
            }
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
        //显示修改考试对话框
        editForm(index, rows){
          this.editTable.examTime = [];
          this.dialogFormVisible = true;
          this.$refs.multipleTable.toggleRowSelection(rows[index]);
          this.editTable.id = rows[index].id;
          this.editTable.name = rows[index].name;
          this.editTable.totalScore = rows[index].totalScore;
          this.editTable.difficulty = rows[index].difficulty;
          this.editTable.examRange = rows[index].examRange;
          this.editTable.classRange = rows[index].classRange;
          this.editTable.curriculumId = rows[index].curriculumId;
          this.editTable.examTime.push(rows[index].startTime);
          this.editTable.examTime.push(rows[index].endTime);
          this.selectIndex = index;
        },
        //修改
        editRow(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              examApi.editExam(this.$refs[formName].model).then(res=>{
                this.$notify({
                  title: '修改提示',
                  message: res.msg,
                  type: res.code === '200'?'success':'error',
                  duration: 4000
                });
                this.tableData[this.selectIndex].name = this.editTable.name;
                this.tableData[this.selectIndex].startTime = this.editTable.examTime[0];
                this.tableData[this.selectIndex].endTime = this.editTable.examTime[1];
                this.dialogFormVisible = false;
              });
            }
            else{
              return false;
            }
          });
        },
        //删除一行
        deleteRow(index, rows) {
          var mess = '已取消删除';
          this.$confirm('此操作将会删除属于该考试信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.examInfo.id = [];
            this.examInfo.id.push(rows[index].id);
            examApi.deleteExam(this.examInfo).then(res=>{
              mess = res.msg;
              this.$message({
                type: res.code === '200'?'success':'warning',
                message: mess
              });
              if(res.code === '200'){
                this.total--;
                rows.splice(index, 1);
              }
              else
                this.$throw();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: mess
            });
          });
        },
        //删除选择的行
        selectDelete(){
          this.examInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.examInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于该考试信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              examApi.deleteExam(this.examInfo).then(res=>{
                mess = res.msg;
                if(res.code === '200'){
                  //删除所选行
                  selectData.forEach((val, index) => {
                    this.tableData.forEach((v, i) => {
                      // id 是每一行的数据id
                      if(val.id === v.id){
                        this.tableData.splice(i, 1);
                        this.total--;
                      }
                    })
                  });
                  this.$refs.multipleTable.clearSelection();
                }
                else
                  this.$throw();
              });
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: mess
              });
            });
          }
          else{
            this.$alert('未选择任何行', '提示', {
              confirmButtonText: '确定',
              closeOnPressEscape: 'false',
              closeOnClickModal: 'true',
            });
          }
        },
        //增加考试
        addExam(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              examApi.addExam(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.examInit(this.page,this.pageSize);
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
        },
        //重置表单
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        //当每页数量发生改变时
        sizeChange(val){
          this.loading = true;
          this.tableData = [];
          this.pageSize = val;
          this.examInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.examInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .exam{
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
