<template>
  <div class="notice_border">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 公告信息详情</span>
          <div class="notice">
            <div style="margin-bottom: 10px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的公告信息"
                style="width: 200px;float: right;margin-right: 20px;cursor: pointer"/>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="400"
              :data="tableData.filter(data =>!search || data.title.toLowerCase().includes(search.toLowerCase())
              || data.name.toLowerCase().includes(search.toLowerCase())
              || data.content.toLowerCase().includes(search.toLowerCase()))"
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
          <span slot="label"><i class="el-icon-document-add"></i> 增加公告信息</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="公告标题" prop="title">
              <el-input type="text" v-model="addForm.title" placeholder="请输入公告标题"></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
              <el-input type="textarea" v-model="addForm.content" placeholder="请输入公告内容"></el-input>
            </el-form-item>
            <el-form-item v-if="userInfo.option === '3'" label="发布范围" prop="issueRange">
              <el-select v-model="addForm.issueRange" placeholder="请选择发布范围">
                <el-option
                  v-for="item in rangeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addNotice('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="修改公告信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable" :rules="rules" class="labelColor" ref="editTable" :label-width="formLabelWidth">
        <el-form-item label="公告标题" prop="title">
          <el-input type="text" v-model="editTable.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input type="textarea" v-model="editTable.content" placeholder="请输入公告内容"></el-input>
        </el-form-item>
        <el-form-item v-if="userInfo.option === '3'" label="发布范围" prop="issueRange">
          <el-select v-model="editTable.issueRange" placeholder="请选择发布范围">
            <el-option
              v-for="item in rangeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
    import * as noticeApi from "./api/manage";
    import util from "../base/api/util";

    export default {
      name: "notice_manage",
      data() {
        return {
          rangeData: [{
            value: '0',
            label: '全部用户'
          }, {
            value: '1',
            label: '学生'
          }, {
            value: '2',
            label: '教师'
          }, {
            value: '3',
            label: '管理员'
          }],
          columns:[
            {prop:'date',label:'发布时间',width:'160',show:true,formatter:this.timestampToTime,sortable:true},
            {prop:'title',label:'公告标题',width:'120',show:true,overflow:true},
            {prop:'content',label:'公告内容',width:'180',show:true,overflow:true},
            {prop:'issueRange',label:'发布范围',width:'110',show:this.$cookieStore.getCookie('option') === '3',filters:[{value: '全部用户', text: '全部用户'},
                {value: '学生', text: '学生'}, {value: '教师', text: '教师'}, {value: '管理员', text: '管理员'}],
              filterMethod:this.filterRange},
            {prop:'identity',label:'发布人身份',width:'110',show:this.$cookieStore.getCookie('option') === '3',filters:[{value: '管理员', text: '管理员'},
                {value: '教师', text: '教师'}],filterMethod:this.filterIdentity},
            {prop:'name',label:'发布人姓名',width:'110',show:this.$cookieStore.getCookie('option') === '3'},
          ],
          tableData: [],
          editTable: {
            id: '',
            title: '',
            content: '',
            issueRange: '',
            username: this.$cookieStore.getCookie('username'),
            identity: this.$cookieStore.getCookie('option') === 2 ? 2 : 1,
          },
          selectIndex: '',
          addForm: {
            title: '',
            content: '',
            issueRange: '',
            username: this.$cookieStore.getCookie('username'),
            identity: this.$cookieStore.getCookie('option') === 2 ? 2 : 1,
          },
          multipleSelection: [],
          search: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          noticeInfo:{
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
          allCount: 0,
          successCount: 0,
          failCount: 0,
          rules: {
            title: [
              { required: true, message: '请输入公告标题', trigger: 'blur' },
            ],
            content: [
              { required: true, message: '请输入公告内容', trigger: 'blur'}
            ],
            issueRange: [
              { required: true, message: '请选择发布范围', trigger: 'change' }
            ],
          }
        };
      },
      mounted(){
        this.noticeInit(this.page,this.pageSize);
      },
      methods: {
        // 时间戳转换成时间
        // 使用element table组件中的formatter属性，传入一个函数
        timestampToTime (row, column) {
          var date = new Date(row.date); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
          return Y+M+D+h+m+s;
        },
        //筛选发布范围
        filterRange(value, row) {
          return row.issueRange === value;
        },
        //筛选发布人身份
        filterIdentity(value, row) {
          return row.identity === value;
        },
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化公告信息
        noticeInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          noticeApi.noticeInit(this.userInfo).then(res=>{
            for(let i in res.list){
              res.list[i].issueRange = this.issueRange(res.list[i].issueRange);
              res.list[i].identity = this.identity(res.list[i].identity);
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
        },
        // 谁可以看到：0:全部用户；1:学生；2:教师；3:管理员；
        issueRange(flag){
          switch (flag) {
            case 0:return '全部用户';
            case 1:return '学生';
            case 2:return '教师';
            case 3:return '管理员';
          }
        },
        // 发布人身份：1:管理员；2:教师
        identity(flag){
          switch (flag) {
            case 1:return '管理员';
            case 2:return '教师';
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
          this.editTable.title = rows[index].title;
          this.editTable.content = rows[index].content;
          if(this.userInfo.option === '3'){
            this.editTable.issueRange = rows[index].issueRange;
          }
          this.selectIndex = index;
        },
        //修改
        editRow(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              noticeApi.editNotice(this.$refs[formName].model).then(res => {
                this.$notify({
                  title: '修改提示',
                  message: res.msg,
                  type: res.code === '200' ? 'success' : 'error',
                  duration: 2000
                });
                this.tableData[this.selectIndex].title = this.editTable.title;
                this.tableData[this.selectIndex].content = this.editTable.content;
                if(this.userInfo.option === '3') {
                  this.tableData[this.selectIndex].issueRange = this.issueRange(parseInt(this.editTable.issueRange));
                }
                this.dialogFormVisible = false;
                util.$emit('noticeState','noticeState');
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
          this.$confirm('此操作将会删除属于该公告的所有信息, 是否继续?', '警示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.noticeInfo.id = [];
            this.noticeInfo.id.push(rows[index].id);
            noticeApi.deleteNotice(this.noticeInfo).then(res=>{
              mess = res.msg;
              if(res.code === '200'){
                this.total--;
                rows.splice(index, 1);
                util.$emit('noticeState','noticeState');
                if(this.tableData.length === 0)
                  this.noticeInit(this.page,this.pageSize);
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
          this.noticeInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.noticeInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于所选公告的所有信息, 是否继续?', '警示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              noticeApi.deleteUser(this.noticeInfo).then(res=>{
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
                    if(this.tableData.length === 0)
                      this.noticeInit(this.page,this.pageSize);
                  });
                  this.$refs.multipleTable.clearSelection();
                  util.$emit('noticeState','noticeState');
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
        addNotice(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              noticeApi.addNotice(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.noticeInit(this.page,this.pageSize);
                  util.$emit('noticeState','noticeState');
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
          this.noticeInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.noticeInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .notice_border{
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
