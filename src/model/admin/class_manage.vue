<template>
  <div class="class">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 班级详情</span>
          <div class="notice">
            <div style="margin-bottom: 20px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的班级名称"
                style="width: 200px;margin-left: 330px;cursor: pointer"/>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="400"
              :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              @row-click="rowClickSelection"
            >
              <el-table-column
                :formatter="formatter"
                type="selection"
                width="100">
              </el-table-column>
              <el-table-column
                prop="name"
                label="班级名称"
                width="220">
              </el-table-column>
              <el-table-column
                prop="count"
                label="班级人数"
                width="220">
              </el-table-column>
              <el-table-column
                prop="collegeId"
                label="所属学院"
                :filters=collegeName
                :filterMethod=filterCollege
                width="220">
                <template slot-scope="scope">
                  <span
                    v-for="item in collegeInfo"
                    v-if="item.id === tableData[scope.$index].collegeId"
                  >{{item.name}}</span>
                </template>
              </el-table-column>
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
          <span slot="label"><i class="el-icon-document-add"></i> 增加班级</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="班级名称" prop="name">
              <el-input v-model.number="addForm.name" placeholder="请输入班级名称"></el-input>
            </el-form-item>
            <el-form-item label="班级名称" prop="count">
              <el-input v-model.number="addForm.count" placeholder="请输入班级人数"></el-input>
            </el-form-item>
            <el-form-item label="学院" prop="collegeId">
              <el-select v-model="addForm.collegeId" placeholder="请选择所在学院">
                <el-option
                  v-for="item in collegeInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addClass('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改教师信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable" :rules="rules" class="labelColor" ref="editTable" :label-width="formLabelWidth">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model.number="editTable.name" placeholder="请输入班级名称"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="count">
          <el-input v-model.number="editTable.count" placeholder="请输入班级人数"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="collegeId">
          <el-select v-model="editTable.collegeId" placeholder="请选择所在学院">
            <el-option
              v-for="item in collegeInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
    import * as classApi from "./api/manage";
    import * as loginApi from "../home/api/login";

    export default {
      name: "class_manage",
      data() {
        return {
          tableData: [],
          selectRow: {
            id: '',
            name: ''
          },
          editTable: {
            id: '',
            name: '',
            count: '',
            collegeId: '',
            collegeName: ''
          },
          addForm: {
            name: '',
            count: '',
            collegeId: ''
          },
          formLabelWidth: '120px',
          collegeInfo: [],
          collegeName: [],
          multipleSelection: [],
          search: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          classInfo:{
            id: [],
            option: this.$cookieStore.getCookie('option'),
            username: this.$cookieStore.getCookie('username')
          },
          loading: true,
          total: 0,
          page:1,
          pageSize:50,
          currentPage: 1,
          dialogFormVisible: false,
          rules: {
            name: [
              { required: true, message: '请输入需要增加的班级名称', trigger: 'blur' }
            ],
            count: [
              { required: true, message: '请输入需要增加的班级人数', trigger: 'blur' },
              { type: 'number',min:1, message: '班级人数必须为数字值且大于0'}
            ],
            collegeId: [
              { required: true, message: '请输入需要增加的班级所属学院', trigger: 'change' }
            ],
          }
        }
      },
      mounted(){
        this.classInit(this.page,this.pageSize);
      },
      methods: {
        //筛选学院
        filterCollege(value, row) {
          return row.collegeName === value;
        },
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化班级信息
        classInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          classApi.classInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
          //获取学院信息
          loginApi.collegeInfo().then(res=>{
            this.collegeInfo = [];
            for(let i in res){
              this.collegeInfo.push(res[i]);
            }
          });
          //获取筛选学院的名称信息
          loginApi.collegeName().then(res=>{
            this.collegeName = [];
            for(let i in res){
              this.collegeName.push(res[i]);
            }
          });
        },
        //通过学院编号查询学院名称
        selectByName(id){
          for(let col in this.collegeInfo){
            if(this.collegeInfo[col].id === id){
              return this.collegeInfo[col].name;
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
          this.editTable.name = rows[index].name;
          this.editTable.count = rows[index].count;
          this.editTable.collegeId = rows[index].collegeId;
          this.editTable.collegeName = rows[index].collegeName;
          this.selectIndex = index;
        },
        //修改
        editRow(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              classApi.editClass(this.$refs[formName].model).then(res => {
                this.$notify({
                  title: '修改提示',
                  message: res.msg,
                  type: res.code === '200' ? 'success' : 'error',
                  duration: 2000
                });
                this.tableData[this.selectIndex].name = this.editTable.name;
                this.tableData[this.selectIndex].count = this.editTable.count;
                this.tableData[this.selectIndex].collegeId = this.editTable.collegeId;
                this.tableData[this.selectIndex].collegeName = this.selectByName(this.editTable.collegeId);
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
          this.$confirm('此操作将会删除属于该班级的全部信息, 是否继续?', '警示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.classInfo.id = [];
            this.classInfo.id.push(rows[index].id);
              classApi.deleteClass(this.classInfo).then(res=>{
              mess = res.msg;
              if(res.code === '200'){
                rows.splice(index, 1);
                this.total--;
                if(this.tableData.length === 0)
                  this.classInit(this.page,this.pageSize);
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
          this.classInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.classInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于所选班级的全部信息, 是否继续?', '警示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              classApi.deleteClass(this.classInfo).then(res=>{
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
                  if(this.tableData.length === 0)
                    this.classInit(this.page,this.pageSize);
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
        //增加班级
        addClass(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              classApi.addClass(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.classInit(this.page,this.pageSize);
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
          this.classInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.classInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .class{
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
</style>
