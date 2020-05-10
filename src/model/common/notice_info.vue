<template>
  <div class="noticeInfo">
    <div class="notice">
      <div style="margin-bottom: 20px">
        <el-button @click="selectDelete()">删除已选</el-button>
        <el-button @click="allRead()">全部标记已读</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-input
          v-model="search"
          placeholder="输入关键字搜索"
          style="width: 200px;float: right;margin-right: 50px;cursor: pointer"
        />
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        ref="multipleTable"
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase())
        || data.title.toLowerCase().includes(search.toLowerCase()))"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="rowClickSelection"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          :formatter="formatter"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="发布时间"
          sortable
          width="200"
          prop="date"
          :formatter="timestampToTime"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="发布人姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="公告标题"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-link :underline="false" @click="titleClick(scope.row)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-pagination
        :hide-on-single-page="true"
        background
        layout="total, prev, pager, next"
        @current-change="switchPage"
        :page-size=pageSize
        :total=total>
      </el-pagination>
    </div>
    <el-dialog
      :title="clickTable.title"
      :visible.sync="dialogVisible"
      width="30%">
      <span>{{clickTable.content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as noticeApi from "./api/info";
  import util from '../base/api/util';
  export default {
    name: "notice_info",
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        clickTable: {
          id: '',
          date: '',
          name: '',
          title: ''
        },
        multipleSelection: [],
        search: '',
        userInfo:{
          username: this.$cookieStore.getCookie('username'),
          option: this.$cookieStore.getCookie('option'),
          page: '',
          count: ''
        },
        noticeLogInfo:{
          id: [],
          option: this.$cookieStore.getCookie('option'),
          username: this.$cookieStore.getCookie('username'),
          state: ''
        },
        loading: true,
        total: 0,
        page:1,
        pageSize:7,
      }
    },
    mounted(){
      this.noticeInit(this.page,this.pageSize);
    },
    methods: {
      tableRowClassName({row,rowIndex}) {
        this.$cookieStore.setCookie('user',123);
        //把每一行的索引放进row
        row.index = rowIndex;
        if (row.state === 0) {
          return 'unread-row';
        }
        return '';
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
            this.tableData.push(res.list[i]);
          }
          this.total = res.total;
          this.loading = false;
        });
      },
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
      //点击公告标题
      titleClick(row){
        this.$refs.multipleTable.toggleRowSelection(row);
        this.dialogVisible = true;
        this.clickTable.id = row.id;
        this.clickTable.date = row.date;
        this.clickTable.name = row.name;
        this.clickTable.title = row.title;
        this.clickTable.content = row.content;
        // 若当前状态是未读状态，则切换到已读状态
        if(row.state === 0){
          this.noticeLogInfo.id = [];
          this.noticeLogInfo.id.push(row.id);
          this.noticeLogInfo.state = 1;
          noticeApi.noticeState(this.noticeLogInfo).then(res=>{
            if(res.code === '200'){
              util.$emit('noticeState','noticeState');
              row.state = 1;
              return '';
            }
          });
        }
      },
      //删除一行
      deleteRow(index, rows) {
        var mess = '已取消删除';
        this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.noticeLogInfo.id = [];
          this.noticeLogInfo.id.push(rows[index].id);
          this.noticeLogInfo.state = 2;
          noticeApi.noticeState(this.noticeLogInfo).then(res=>{
            mess = res.msg;
            if(res.code === '200'){
              rows.splice(index, 1);
              this.total--;
              if(this.tableData.length === 0)
                this.studentInit(this.page,this.pageSize);
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
      },
      //删除选择的行
      selectDelete(){
        this.noticeLogInfo.id = [];
        const selectData = this.$refs.multipleTable.selection;
        //得到所选行的公告编号
        for(let i in selectData){
          this.noticeLogInfo.id.push(selectData[i].id);
        }
        if(selectData.length !== 0){
          var mess = '已取消删除';
          this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.noticeLogInfo.state = 2;
            noticeApi.noticeState(this.noticeLogInfo).then(res=>{
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
                  this.studentInit(this.page,this.pageSize);
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
      //全部标为已读
      allRead(){
        this.noticeLogInfo.id = [];
        //删选当前公告状态，是否已读
        for(let i in this.tableData){
          if(this.tableData[i].state === 0){
            this.noticeLogInfo.id.push(this.tableData[i].id);
            this.tableData[i].state = 1;
          }
        }
        this.noticeLogInfo.state = 1;
        noticeApi.noticeState(this.noticeLogInfo).then(res=>{
          if(res.code === '200'){
            util.$emit('noticeState','noticeState');
            return '';
          }
        });
      },
      //点击切换页面按钮
      switchPage(val) {
        this.tableData = [];
        this.curriculumInit(val,this.pageSize);
        this.loading = true;
      },
    }
  }
</script>

<style>
  .noticeInfo{
    background-color: #e3e3e3;
    margin-top: 60px;
    float: right;
    min-height: 580px;
    width: 84%;
    overflow:auto;
    z-index: -1;
  }
  .notice{
    padding: 20px 0 0 20px;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table .unread-row {
    background: oldlace;
    font-weight:bold;
  }
</style>
