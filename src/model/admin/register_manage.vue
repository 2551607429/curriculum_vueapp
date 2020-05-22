<template>
  <div class="register">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 注册码详情</span>
          <div class="notice">
            <div style="margin-bottom: 20px">
              <el-button @click="toggleSelection()">取消选择</el-button>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 75%"
              @selection-change="handleSelectionChange"
              @row-click="rowClickSelection"
            >
              <el-table-column
                :formatter="formatter"
                type="selection"
                width="100">
              </el-table-column>
              <el-table-column
                prop="keyName"
                label="用户身份"
                width="200">
              </el-table-column>
              <el-table-column
                prop="registerKey"
                label="注册码"
                width="200">
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
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import * as registerApi from "./api/manage";

    export default {
      name: "register_manage",
      data() {
        return {
          tableData: [],
          selectRow: {
            id: '',
            registerKey: ''
          },
          multipleSelection: [],
          search: '',
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option')
          },
          loading: true
        }
      },
      created(){
        this.registerInit();
      },
      methods: {
        formatter(row, column ,cellValue) {
          //放回索引值
          return this.pageSize * (this.page - 1)  + 1+ row.index;
        },
        //初始化注册信息
        registerInit(){
          registerApi.registerInit(this.userInfo).then(res=>{
            for(let i in res){
              this.tableData.push(res[i]);
            }
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
          this.$prompt('请输入想要修改的注册码', '编辑注册码', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputErrorMessage: '注册名称已存在',
            inputValue: rows[index].registerKey,
          }).then(({ value }) => {
            this.selectRow.id = rows[index].id;
            this.selectRow.registerKey = value;
            registerApi.editRegister(this.selectRow).then(res=>{
              this.$notify({
                title: '修改提示',
                message: res.msg,
                type: res.code === '200'?'success':'error',
                duration: 2000
              });
              rows[index].registerKey = value;
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消修改'
            });
          });
        }
      }
    }
</script>

<style>
  .register{
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
