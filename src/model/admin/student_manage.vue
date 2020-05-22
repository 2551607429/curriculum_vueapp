<template>
  <div class="student">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 学生信息详情</span>
          <div class="notice">
            <div style="margin-bottom: 10px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的学生相关信息"
                style="width: 200px;float: right;margin-right: 100px;cursor: pointer"/>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="400"
              :data="tableData.filter(data => !search || data.stuId.toLowerCase().includes(search.toLowerCase())
            || data.username.toLowerCase().includes(search.toLowerCase())
            || data.name.toLowerCase().includes(search.toLowerCase())
            || data.tel.toLowerCase().includes(search.toLowerCase())
            || data.address.toLowerCase().includes(search.toLowerCase()))"
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
              :page-sizes="[10, 25, 50, 100, 200, 400, total]"
              :page-size=pageSize
              layout="total, sizes, prev, pager, next, jumper"
              :total=total>
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document-add"></i> 增加学生信息</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="学号" prop="stuId">
              <el-input type="text" v-model="addForm.stuId" placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="addForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="addForm.pass" show-password placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="班级" prop="classId">
              <el-select v-model="addForm.classId" placeholder="请选择所在班级">
                <el-option
                  v-for="item in classInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input type="text" v-model="addForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="addForm.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input type="text" v-model="addForm.tel" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input type="text" v-model="addForm.address" placeholder="请输入家庭住址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addStudent('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-upload"></i> 批量上传学生信息</span>
          <div>
            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" ></upload-excel-component>
            <div style="display: flex;justify-content: center;margin-top: 20px">
              <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd"
                         class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
                请先下载学生信息上传模板
              </el-button>
            </div>
            <div v-if="allCount" style="margin-top: 15px" >
              <span style="color: #4ab7bd">上传总记录条数：{{ allCount }}</span>
              <span style="color: #67c23a;margin-left: 30px">成功总记录条数：{{ successCount }}</span>
              <span style="color: #FF0000;margin-left: 30px">失败总记录条数：{{ failCount }}</span>
            </div>
            <el-table :data="failData" border highlight-current-row height="210" style="width: 100%;margin-top:20px;">
              <el-table-column v-for="(item, index) of tableHeader" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改学生信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable" :rules="rules" class="labelColor" :label-width="formLabelWidth">
        <el-form-item label="学号" prop="stuId">
          <el-input type="text" v-model="editTable.stuId" ref="stuId" ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="editTable.username" :disabled="true" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="editTable.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editTable.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
          <el-select v-model="editTable.classId" placeholder="请选择所在班级">
            <el-option
              v-for="item in classInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input type="text" v-model="editTable.tel"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input type="text" v-model="editTable.address"></el-input>
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
  import waves from '@/directive/waves'
  import * as StudentApi from "./api/manage";
  import * as loginApi from "../home/api/login"; // Waves directive

  export default {
      name: "student_manage",
      components: { UploadExcelComponent },
      directives: { waves },
      data() {
        //验证用户名是否已注册
        var validateUsername = (rule, value, callback) => {
          this.addForm.option = '1';
          loginApi.userNameUnique(this.addForm).then(res=>{
            if(res.code === '101'){
              callback(res.msg);
            }
            else
              callback();
          });
        };
        return {
          columns:[
            {prop:'stuId',label:'学号',width:'120',show:true},
            {prop:'username',label:'用户名',width:'130',show:true},
            {prop:'name',label:'姓名',width:'100',show:true},
            {prop:'gender',label:'性别',width:'60',show:true,
              filters:[{text:'男',value:'男'},{text:'女',value:'女'}],filterMethod:this.filterGender},
            {prop:'className',label:'班级',width:'120',show:true,filters:[],filterMethod:this.filterClass},
            {prop:'tel',label:'联系电话',width:'120',show:true},
            {prop:'address',label:'家庭住址',width:'180',show:true,overflow:true},
            ],
          tableData: [],
          failData: [],
          tableHeader: [],
          editTable: {
            id: '',
            stuId: '',
            username: '',
            name: '',
            gender: '男',
            classId: '',
            className: '',
            tel: '',
            address: '',
            option: '1'
          },
          selectIndex: '',
          addForm: {
            stuId: '',
            username: '',
            pass: '',
            name: '',
            gender: '男',
            classId: '',
            tel: '',
            address: '',
            option: '1'
          },
          classInfo: [],
          className: [],
          multipleSelection: [],
          search: '',
          searchTel: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: '1',
            page: '',
            count: ''
          },
          studentInfo:{
            id: [],
            option: '1',
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
          allCount: 0,
          successCount: 0,
          failCount: 0,
          rules: {
            pass: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { pattern: /^\w{6,18}$/, message: '长度在6~18之间，只能包含字母、数字和下划线' }
            ],
            stuId: [
              { required: true, message: '请输入学号', trigger: 'blur' },
              { pattern: /^\d{4,16}$/, message: '长度为4-16位，只允许数字' }
            ],
            username: [
              { pattern: /^[a-zA-Z]\w{4,15}$/, message: '字母开头，长度为5-16位，允许包含字母数字下划线' },
              { required: true, validator: validateUsername, trigger: 'blur' }
            ],
            classId: [
              { required: true, message: '请选择所在班级', trigger: 'change' }
            ],
            tel: [
              { required: true, pattern: /^1\d{10}$/, message: '请输入正确的电话格式' }
            ],
          }
        };
      },
      mounted(){
        this.studentInit(this.page,this.pageSize);
      },
      methods: {
        //筛选班级
        filterClass(value, row) {
          return row.className === value;
        },
        //筛选性别
        filterGender(value, row) {
          return row.gender === value;
        },
        //下载课程上传模板
        handleDownload() {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '(必填)学号(4-16位数字)',
              '(必填)用户名(由字母开头的5-16位字母、数字、下划线)',
              '(必填)密码(6-18位字母、数字、下划线)',
              '(必填)班级(系统中存在的)',
              '姓名',
              '性别',
              '联系电话',
              '家庭住址',
            ];
            excel.export_json_to_excel({
              header: tHeader,
              data: [],
              filename: '学生信息上传模板'
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
          const studentList = [];
          results.forEach((item, index) => {
            const student = {};
            Object.keys(item).forEach((key) => {
              if (key === '(必填)学号(4-16位数字)') {
                student.stuId = (String)(item[key])
              }
              if (key === '(必填)用户名(由字母开头的5-16位字母、数字、下划线)') {
                student.username = (String)(item[key])
              }
              if (key === '(必填)密码(6-18位字母、数字、下划线)') {
                student.pass = (String)(item[key])
              }
              if (key === '(必填)班级(系统中存在的)') {
                student.className = (String)(item[key])
              }
              if (key === '姓名') {
                student.name = (String)(item[key])
              }
              if (key === '性别') {
                student.gender = (String)(item[key])
              }
              if (key === '联系电话') {
                student.tel = (String)(item[key])
              }
              if (key === '家庭住址') {
                student.address = (String)(item[key])
              }
              student.option = '1'
            });
            studentList.push(student)
          });
          this.insertStudentInfoList(studentList)
        },
        // 插入数据库学生信息表
        async insertStudentInfoList(studentList) {
          StudentApi.uploadUser(studentList).then(res=>{
            if (res.code === '200') {
              this.tableHeader = [
                {prop:'stuId',label:'学号',width:'140'},
                {prop:'username',label:'用户名',width:'140'},
                {prop:'name',label:'姓名',width:'120'},
                {prop:'gender',label:'性别',width:'80'},
                {prop:'className',label:'班级',width:'140'},
                {prop:'key',label:'上传失败原因',width:'260'}];
              this.failData = res.data.responseList[0];
              this.allCount = res.data.allCount;
              this.successCount = res.data.successCount;
              this.failCount = res.data.failCount;
              this.tableData = [];
              this.studentInit(this.page,this.pageSize);
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
        //初始化学生信息
        studentInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          StudentApi.userInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
          //获取班级信息
          loginApi.classInfo().then(res=>{
            this.classInfo = [];
            for(let i in res){
              this.classInfo.push(res[i]);
            }
          });
          //获取筛选班级的名称信息
          loginApi.className().then(res=>{
            this.columns[4].filters = [];
            for(let i in res){
              this.columns[4].filters.push(res[i]);
            }
          });
        },
        //通过班级编号查询学院名称
        selectByName(id){
          for(let col in this.classInfo){
            if(this.classInfo[col].id === id){
              return this.classInfo[col].name;
            }
          }
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
        //显示修改课程对话框
        editForm(index, rows){
          this.dialogFormVisible = true;
          this.$refs.multipleTable.toggleRowSelection(rows[index]);
          this.editTable.id = rows[index].id;
          this.editTable.stuId = rows[index].stuId;
          this.editTable.username = rows[index].username;
          this.editTable.name = rows[index].name;
          this.editTable.gender = rows[index].gender;
          this.editTable.classId = rows[index].classId;
          this.editTable.className = rows[index].className;
          this.editTable.tel = rows[index].tel;
          this.editTable.address = rows[index].address;
          this.selectIndex = index;
        },
        //修改
        editRow() {
          StudentApi.editUser(this.editTable).then(res=>{
            this.$notify({
              title: '修改提示',
              message: res.msg,
              type: res.code === '200'?'success':'error',
              duration: 2000
            });
            this.tableData[this.selectIndex].stuId = this.editTable.stuId;
            this.tableData[this.selectIndex].username = this.editTable.username;
            this.tableData[this.selectIndex].name = this.editTable.name;
            this.tableData[this.selectIndex].gender = this.editTable.gender;
            this.tableData[this.selectIndex].classId = this.editTable.classId;
            this.tableData[this.selectIndex].className = this.selectByName(this.editTable.classId);
            this.tableData[this.selectIndex].tel = this.editTable.tel;
            this.tableData[this.selectIndex].address = this.editTable.address;
            this.dialogFormVisible = false;
          });
        },
        //删除一行
        deleteRow(index, rows) {
          var mess = '已取消删除';
          this.$confirm('此操作将会删除属于该学生的所有信息, 是否继续?', '警示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.studentInfo.id = [];
            this.studentInfo.id.push(rows[index].id);
            StudentApi.deleteUser(this.studentInfo).then(res=>{
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
          this.studentInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.studentInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于所选学生的所有信息, 是否继续?', '警示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              StudentApi.deleteUser(this.studentInfo).then(res=>{
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
                    });
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
        //增加题型
        addStudent(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              StudentApi.addUser(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.studentInit(this.page,this.pageSize);
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
          this.studentInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.loading = true;
          this.tableData = [];
          this.currentPage = val;
          this.studentInit(val,this.pageSize);
        },
      }
    }
</script>

<style>
  .student{
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
