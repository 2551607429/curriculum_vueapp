<template>
  <div class="chapter">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 章节详情</span>
          <div class="notice">
            <div style="margin-bottom: 20px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的章节名称"
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
                label="章节名称"
                width="500">
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
                    @click.native.prevent="editRow(scope.$index, tableData)"
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
          <span slot="label"><i class="el-icon-document-add"></i> 增加章节</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" label-width="100px"  style="width: 600px" class="labelColor">
            <el-form-item label="章节名称" prop="name">
              <el-input v-model.number="addForm.name" placeholder="请输入章节名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addType('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import * as chapterApi from "./api/manage";

    export default {
      name: "chapter_manage",
      data() {
        return {
          tableData: [],
          selectRow: {
            id: '',
            name: ''
          },
          addForm: {
            name: ''
          },
          multipleSelection: [],
          search: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          chapterInfo:{
            id: [],
            option: this.$cookieStore.getCookie('option'),
            username: this.$cookieStore.getCookie('username')
          },
          loading: true,
          total: 0,
          page:1,
          pageSize:50,
          currentPage: 1,
          rules: {
            name: [
              { required: true, message: '请输入需要增加的章节名称', trigger: 'blur' }
            ]
          }
        }
      },
      mounted(){
        this.chapterInit(this.page,this.pageSize);
      },
      methods: {
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化章节信息
        chapterInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          chapterApi.chapterInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
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
        //修改
        editRow(index, rows) {
          this.$refs.multipleTable.toggleRowSelection(rows[index]);
          this.$prompt('请输入想要修改的章节名称', '编辑章节', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputErrorMessage: '章节名称已存在',
            inputValue: rows[index].name,
          }).then(({ value }) => {
            this.selectRow.id = rows[index].id;
            this.selectRow.name = value;
            chapterApi.editChapter(this.selectRow).then(res=>{
              this.$notify({
                title: '修改提示',
                message: res.msg,
                type: res.code === '200'?'success':'error',
                duration: 2000
              });
              rows[index].name = value;
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消修改'
            });
          });
        },
        //删除一行
        deleteRow(index, rows) {
          var mess = '已取消删除';
          this.$confirm('此操作将会删除属于该章节的全部信息, 是否继续?', '警示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.chapterInfo.id = [];
            this.chapterInfo.id.push(rows[index].id);
            chapterApi.deleteChapter(this.chapterInfo).then(res=>{
              mess = res.msg;
              if(res.code === '200'){
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
          this.chapterInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.chapterInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于所选章节的全部信息, 是否继续?', '警示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              chapterApi.deleteChapter(this.chapterInfo).then(res=>{
                mess = res.msg;
                if(res.code === '200'){
                  //删除所选行
                  selectData.forEach((val, index) => {
                    this.tableData.forEach((v, i) => {
                      // id 是每一行的数据id
                      if(val.id === v.id){
                        this.tableData.splice(i, 1);
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
        //增加题型
        addType(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.userInfo.option === '3'){
                chapterApi.addChapter(this.$refs[formName].model).then(res=>{
                  if(res.code === '200'){
                    this.resetForm(formName);
                    this.tableData = [];
                    this.chapterInit(this.page,this.pageSize);
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
              }
              else{
                this.$alert("没有权限增加", '提醒', {
                  confirmButtonText: '确定'
                });
              }
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
          this.chapterInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.chapterInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .chapter{
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
