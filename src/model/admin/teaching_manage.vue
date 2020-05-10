<template>
  <div class="teaching">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 任课详情</span>
          <div class="notice">
            <div style="margin-bottom: 10px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的任课信息"
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
                width="280">
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
          <span slot="label"><i class="el-icon-document-add"></i> 增加任课</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="教师" prop="teacherId">
              <el-select v-model="addForm.teacherId" filterable placeholder="请选择任课教师">
                <el-option
                  v-for="item in teacherInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="classId">
              <el-select v-model="addForm.classId" multiple filterable placeholder="请选择任课班级">
                <el-option
                  v-for="item in classInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程" prop="curriculumId">
              <el-select v-model="addForm.curriculumId" filterable placeholder="请选择任课课程">
                <el-option
                  v-for="item in curriculumInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任课日期范围" prop="teachingDate">
              <el-date-picker
                v-model="addForm.teachingDate"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addTeaching('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-upload"></i> 批量上传任课</span>
          <div>
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" ></upload-excel-component>
            <div style="display: flex;justify-content: center;margin-top: 20px">
              <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd"
                         class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                请先下载任课信息上传模板
              </el-button>
            </div>
            <div v-if="allCount" style="margin-top: 15px" >
              <span style="color: #4ab7bd">上传总记录条数：{{ allCount }}</span>
              <span style="color: #67c23a;margin-left: 30px">成功总记录条数：{{ successCount }}</span>
              <span style="color: #FF0000;margin-left: 30px">失败总记录条数：{{ failCount }}</span>
            </div>
            <el-table :data="failData" border highlight-current-row height="400" style="width: 100%;margin-top:20px;">
              <el-table-column v-for="(item, index) of tableHeader" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改任课信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable"  class="labelColor">
        <el-form-item label="任课名称" :label-width="formLabelWidth">
          <el-input v-model="editTable.name"></el-input>
        </el-form-item>
        <el-form-item label="任课章节数" :label-width="formLabelWidth">
          <el-input v-model="editTable.chapterCount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="任课信息简介" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="editTable.info" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRow()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import UploadExcelComponent from '@/components/UploadExcel/index.vue'
    import notice from './notice_manage'
    import * as teachingApi from "./api/manage";
    import waves from '@/directive/waves'
    import * as loginApi from "../home/api/login"; // Waves directive

    export default {
      name: "teaching_manage",
      components: { UploadExcelComponent },
      directives: { waves },
      data() {
        return {
          columns:[
            {prop:'teacherName',label:'教师姓名',width:'150',show:true,filters:[],filterMethod:this.filterTeacher},
            {prop:'curriculumName',label:'课程名称',width:'150',show:true,filters:[],filterMethod:this.filterCurriculum},
            {prop:'className',label:'班级名称',width:'150',show:true,filters:[],filterMethod:this.filterClass},
            {prop:'startTime',label:'开始时间',width:'160',show:true,formatter:this.timestampToTime,sortable:true},
            {prop:'endTime',label:'结束时间',width:'160',show:true,formatter:this.timestampToTimeEnd,sortable:true},
          ],
          failData: [],
          tableData: [],
          editTable: {
            id: '',
            name: '',
            chapterCount: '',
            info: ''
          },
          selectIndex: '',
          addForm: {
            teacherId: '',
            classId: '',
            curriculumId: '',
            teachingDate: '',
          },
          multipleSelection: [],
          search: '',
          teacherInfo: [],
          classInfo: [],
          curriculumInfo: [],
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          teachingInfo:{
            id: [],
            option: this.$cookieStore.getCookie('option'),
            username: this.$cookieStore.getCookie('username')
          },
          formLabelWidth: '120px',
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
            teacherId: [
              { required: true, message: '请选择任课教师', trigger: 'change' }
            ],
            classId: [
              { required: true, message: '请选择任课班级', trigger: 'change' }
            ],
            curriculumId: [
              { required: true, message: '请选择任课课程', trigger: 'change' }
            ],
            teachingDate: [
              { type: 'date', required: true, message: '请选择任课日期', trigger: 'change' }
            ],
          }
        }
      },
      mounted(){
        this.teachingInit(this.page,this.pageSize);
      },
      methods: {
        //筛选教师
        filterTeacher(value, row) {
          return row.teacherName === value;
        },
        //筛选课程
        filterCurriculum(value, row) {
          return row.curriculumName === value;
        },
        //筛选班级
        filterClass(value, row) {
          return row.className === value;
        },
        // 时间戳转换成时间（开始时间）
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTime (row, column) {
          var date = new Date(row.startTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          return Y+M+D;
        },
        // 时间戳转换成时间（结束时间）
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTimeEnd (row, column) {
          var date = new Date(row.endTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          return Y+M+D;
        },
        //下载任课上传模板
        handleDownload() {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '(必填)任课名称',
              '(必填)任课章节数',
              '(必填)任课信息简介'
            ];
            excel.export_json_to_excel({
              header: tHeader,
              data: [],
              filename: '任课信息上传模板'
            });
            this.downloadLoading = false
          })
        },
        //判断文件大小
        beforeUpload(file) {
          const isLt1M = file.size / 1024 / 1024 < 1;
          if (isLt1M) {
            return true
          }
          this.$message({
            message: '请上传小于1M的文件',
            type: 'warning'
          });
          return false;
        },
        //存储内容
        handleSuccess({ results, header }) {
          const teachingList = [];
          results.forEach((item, index) => {
            const teaching = {};
            Object.keys(item).forEach((key) => {
              if (key === '(必填)任课名称') {
                teaching.name = (String)(item[key])
              }
              if (key === '(必填)任课章节数') {
                teaching.chapterCount = item[key]
              }
              if (key === '(必填)任课信息简介') {
                teaching.info = (String)(item[key])
              }
            });
            teachingList.push(teaching)
          });
          this.insertTeachingInfoList(teachingList)
        },
        // 插入数据库学生信息表
        async insertTeachingInfoList(teachingList) {
          teachingApi.uploadTeaching(teachingList).then(res=>{
            if (res.code === '200') {
              this.tableHeader = [
                {prop:'name',label:'任课名称',width:'140'},
                {prop:'chapterCount',label:'任课章节数',width:'140'},
                {prop:'info',label:'任课章节数',width:'120'}];
              this.failData = res.data.responseList[0];
              this.allCount = res.data.allCount;
              this.successCount = res.data.successCount;
              this.failCount = res.data.failCount;
              this.tableData = [];
              this.teachingInit(this.page,this.pageSize);
              this.$message({
                message: res.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          });
        },
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化题型信息
        teachingInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          teachingApi.teachingInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
          //获取教师信息
          teachingApi.teacherInfo().then(res=>{
            this.teacherInfo = [];
            for(let i in res){
              this.teacherInfo.push(res[i]);
            }
          });
          //获取课程信息
          teachingApi.curriculumInfo().then(res=>{
            this.curriculumInfo = [];
            for(let i in res){
              this.curriculumInfo.push(res[i]);
            }
          });
          //获取班级信息
          loginApi.classInfo().then(res=>{
            this.classInfo = [];
            for(let i in res){
              this.classInfo.push(res[i]);
            }
          });
          //获取筛选班级的名称信息
          teachingApi.teachingInfo().then(res=>{
            this.columns[0].filters = [];
            this.columns[1].filters = [];
            this.columns[2].filters = [];
            for(let i in res[0]){
              this.columns[0].filters.push(res[0][i]);
            }
            for(let i in res[1]){
              this.columns[1].filters.push(res[1][i]);
            }
            for(let i in res[2]){
              this.columns[2].filters.push(res[2][i]);
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
        //显示修改任课对话框
        editForm(index, rows){
          this.dialogFormVisible = true;
          this.$refs.multipleTable.toggleRowSelection(rows[index]);
          this.editTable.id = rows[index].id;
          this.editTable.name = rows[index].name;
          this.editTable.chapterCount = rows[index].chapterCount;
          this.editTable.info = rows[index].info;
          this.selectIndex = index;
        },
        //修改
        editRow() {
          teachingApi.editTeaching(this.editTable).then(res=>{
            this.$notify({
              title: '修改提示',
              message: res.msg,
              type: res.code === '200'?'success':'error',
              duration: 2000
            });
            this.tableData[this.selectIndex].name = this.editTable.name;
            this.tableData[this.selectIndex].chapterCount = this.editTable.chapterCount;
            this.tableData[this.selectIndex].info = this.editTable.info;
            this.dialogFormVisible = false;
          });
        },
        //删除一行
        deleteRow(index, rows) {
          var mess = '已取消删除';
          this.$confirm('此操作将会删除属于该任课的授课信息、知识点、题目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.teachingInfo.id = [];
            this.teachingInfo.id.push(rows[index].id);
            teachingApi.deleteTeaching(this.teachingInfo).then(res=>{
              mess = res.msg;
              if(res.code === '200'){
                this.total--;
                rows.splice(index, 1);
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
        },
        //删除选择的行
        selectDelete(){
          this.teachingInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.teachingInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于该任课的授课信息、知识点、题目, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              teachingApi.deleteTeaching(this.teachingInfo).then(res=>{
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
        //增加任课
        addTeaching(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              teachingApi.addTeaching(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.teachingInit(this.page,this.pageSize);
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
          this.teachingInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.teachingInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .teaching{
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
