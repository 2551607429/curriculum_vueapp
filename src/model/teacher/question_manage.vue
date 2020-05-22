<template>
  <div class="question">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 题库详情</span>
          <div class="notice">
            <div style="margin-bottom: 10px">
              <el-button @click="selectDelete()">删除已选</el-button>
              <el-button @click="toggleSelection()">取消选择</el-button>
              <el-input
                v-model="search"
                placeholder="查找此页中的题目信息"
                style="width: 200px;float: right;margin-right: 100px;cursor: pointer"/>
            </div>
            <el-table
              v-loading="loading"
              element-loading-text="拼命加载中"
              ref="multipleTable"
              height="440"
              :data="tableData.filter(data => !search || data.stem.toLowerCase().includes(search.toLowerCase())
              || data.answer.toLowerCase().includes(search.toLowerCase()))"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              @row-click="rowClickSelection"
            >
              <el-table-column
                :formatter="formatter"
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" style="width:48%;float:left;" inline class="labelColor">
                    <el-form-item>
                      <b><span style="color: #999999;">题干：</span></b>
                      <span>{{ props.row.stem}}</span><br>
                      <template v-if="props.row.typeId === 1 || props.row.typeId === 5">
                        <span>　　　选项A：{{ props.row.optionA}}</span><br>
                        <span>　　　选项B：{{ props.row.optionB}}</span><br>
                        <span>　　　选项C：{{ props.row.optionC}}</span><br>
                        <span>　　　选项D：{{ props.row.optionD}}</span>
                      </template>
                    </el-form-item>
                  </el-form>
                  <el-form label-position="left" style="width:48%;float:right;" :label-width=formLabelWidth inline class="labelColor">
                    <el-form-item>
                      <b><span style="color: #999999;">答案：</span></b>
                      <span>{{ props.row.answer}}</span>
                    </el-form-item><br>
                    <template v-if="props.row.typeId === 4">
                      <el-form-item>
                        <b><span style="color: #999999;">关键字：</span></b>
                        <span>{{ props.row.keyword}}</span>
                      </el-form-item><br>
                    </template>
                    <el-form-item>
                      <b><span style="color: #999999;">难度：</span></b>
                      <el-rate
                        v-model="props.row.difficulty"
                        disabled
                        show-score
                        text-color="#ff9900">
                      </el-rate>
                    </el-form-item><br>
                  </el-form>
                </template>
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
          <span slot="label"><i class="el-icon-document-add"></i> 增加题目</span>
          <el-form :model="addForm" status-icon :rules="rules" ref="addForm" :label-width="formLabelWidth"  style="width: 600px" class="labelColor">
            <el-form-item label="题型" prop="typeId">
              <el-select v-model="addForm.typeId" filterable placeholder="请选择题型">
                <el-option
                  v-for="item in typeInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属课程" prop="curriculumId">
              <el-select v-model="addForm.curriculumId" filterable placeholder="请选择所属课程">
                <el-option
                  v-for="item in curriculumInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属章节" prop="chapterId">
              <el-select v-model="addForm.chapterId" filterable placeholder="请选择所属章节">
                <el-option
                  v-for="item in chapterInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题干" prop="stem">
              <el-input
                type="textarea"
                :autosize="{minRows: 2}"
                placeholder="请输入题干内容"
                v-model="addForm.stem">
              </el-input>
            </el-form-item>
<!--            当是选择题时，需要输入选项A B C D -->
            <template v-if="addForm.typeId === 1 || addForm.typeId === 5">
              <el-form-item label="选项A" prop="optionA"
                            :rules="{required: true, message: '选项A不能为空', trigger: 'blur' }">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="请输入选项A内容"
                  v-model="addForm.optionA">
                </el-input>
              </el-form-item>
              <el-form-item label="选项B" prop="optionB"
                            :rules="{required: true, message: '选项B不能为空', trigger: 'blur' }">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="请输入选项B内容"
                  v-model="addForm.optionB">
                </el-input>
              </el-form-item>
              <el-form-item label="选项C" prop="optionC"
                            :rules="{required: true, message: '选项C不能为空', trigger: 'blur' }">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="请输入选项C内容"
                  v-model="addForm.optionC">
                </el-input>
              </el-form-item>
              <el-form-item label="选项D" prop="optionD"
                            :rules="{required: true, message: '选项D不能为空', trigger: 'blur' }">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="请输入选项D内容"
                  v-model="addForm.optionD">
                </el-input>
              </el-form-item>
            </template>
<!--            当是简答题时，需要输入关键字-->
            <template v-if="addForm.typeId === 4">
              <el-form-item label="关键字" prop="keyword"
                            :rules="{required: true, message: '关键字不能为空', trigger: 'blur' }">
                <el-input
                  type="textarea"
                  :autosize="{minRows: 2}"
                  placeholder="请输入简答题的关键字内容，每个关键字之间以；隔开"
                  v-model="addForm.keyword">
                </el-input>
              </el-form-item>
            </template>
            <el-form-item label="答案" prop="answer">
              <el-input
                type="textarea"
                :autosize="{minRows: 2}"
                placeholder="请输入答案内容（填空题每个答案之间用；隔开）"
                v-model="addForm.answer">
              </el-input>
            </el-form-item>
            <el-form-item label="难度" prop="difficulty">
              <el-rate
                v-model="addForm.difficulty"
                show-score>
              </el-rate>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addQuestion('addForm')">增加</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
<!--        <el-tab-pane>-->
<!--          <span slot="label"><i class="el-icon-upload"></i> 批量上传题库</span>-->
<!--          <div>-->
<!--            <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" ></upload-excel-component>-->
<!--            <div style="display: flex;justify-content: center;margin-top: 20px">-->
<!--              <el-button v-waves :loading="downloadLoading" style="background-color: #4ab7bd;border-color: #4ab7bd"-->
<!--                         class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
<!--                请先下载题库信息上传模板-->
<!--              </el-button>-->
<!--            </div>-->
<!--            <div v-if="allCount" style="margin-top: 15px" >-->
<!--              <span style="color: #4ab7bd">上传总记录条数：{{ allCount }}</span>-->
<!--              <span style="color: #67c23a;margin-left: 30px">成功总记录条数：{{ successCount }}</span>-->
<!--              <span style="color: #FF0000;margin-left: 30px">失败总记录条数：{{ failCount }}</span>-->
<!--            </div>-->
<!--            <el-table :data="failData" border highlight-current-row height="210" style="width: 100%;margin-top:20px;">-->
<!--              <el-table-column v-for="(item, index) of tableHeader"-->
<!--                               :key="index" :prop="item.prop"-->
<!--                               :label="item.label" :width="item.width"-->
<!--                               :formatter="item.formatter"/>-->
<!--            </el-table>-->
<!--          </div>-->
<!--        </el-tab-pane>-->
      </el-tabs>
    </div>
    <el-dialog title="修改题库信息" :visible.sync="dialogFormVisible">
      <el-form :model="editTable" :rules="rules" class="labelColor" ref="editTable" :label-width="formLabelWidth">
        <el-form-item label="所属课程" prop="curriculumId">
          <el-select v-model="editTable.curriculumId" filterable placeholder="请选择所属课程">
            <el-option
              v-for="item in curriculumInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属章节" prop="chapterId">
          <el-select v-model="editTable.chapterId" filterable placeholder="请选择所属章节">
            <el-option
              v-for="item in chapterInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题干" prop="stem">
          <el-input
            type="textarea"
            :autosize="{minRows: 2}"
            placeholder="请输入题干内容"
            v-model="editTable.stem">
          </el-input>
        </el-form-item>
        <!--            当是选择题时，需要输入选项A B C D -->
        <template v-if="editTable.typeId === 1 || editTable.typeId === 5">
          <el-form-item label="选项A" prop="optionA"
                        :rules="{required: true, message: '选项A不能为空', trigger: 'blur' }">
            <el-input
              type="textarea"
              :autosize="{minRows: 2}"
              placeholder="请输入选项A内容"
              v-model="editTable.optionA">
            </el-input>
          </el-form-item>
          <el-form-item label="选项B" prop="optionB"
                        :rules="{required: true, message: '选项B不能为空', trigger: 'blur' }">
            <el-input
              type="textarea"
              :autosize="{minRows: 2}"
              placeholder="请输入选项B内容"
              v-model="editTable.optionB">
            </el-input>
          </el-form-item>
          <el-form-item label="选项C" prop="optionC"
                        :rules="{required: true, message: '选项C不能为空', trigger: 'blur' }">
            <el-input
              type="textarea"
              :autosize="{minRows: 2}"
              placeholder="请输入选项C内容"
              v-model="editTable.optionC">
            </el-input>
          </el-form-item>
          <el-form-item label="选项D" prop="optionD"
                        :rules="{required: true, message: '选项D不能为空', trigger: 'blur' }">
            <el-input
              type="textarea"
              :autosize="{minRows: 2}"
              placeholder="请输入选项D内容"
              v-model="editTable.optionD">
            </el-input>
          </el-form-item>
        </template>
        <!--            当是简答题时，需要输入关键字-->
        <template v-if="editTable.typeId === 4">
          <el-form-item label="关键字" prop="keyword"
                        :rules="{required: true, message: '关键字不能为空', trigger: 'blur' }">
            <el-input
              type="textarea"
              :autosize="{minRows: 2}"
              placeholder="请输入简答题的关键字内容，每个关键字之间以；隔开"
              v-model="editTable.keyword">
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="答案" prop="answer">
          <el-input
            type="textarea"
            :autosize="{minRows: 2}"
            placeholder="请输入答案内容（填空题每个答案之间用；隔开）"
            v-model="editTable.answer">
          </el-input>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-rate
            v-model="editTable.difficulty"
            show-score>
          </el-rate>
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
    import UploadExcelComponent from '@/components/UploadExcel/index.vue'
    import waves from '@/directive/waves'
    import * as questionApi from "./api/manage";
    import * as manageApi from "../admin/api/manage";

    export default {
      name: "question_manage",
      components: { UploadExcelComponent },
      directives: { waves },
      data() {
        return {
          columns:[
            {prop:'typeName',label:'题型',width:'100',show:true},
            {prop:'stem',label:'试题内容',width:'200',show:true,overflow:true},
            {prop:'difficulty',label:'难度',width:'100',show:true},
            {prop:'curriculumName',label:'所属课程',width:'160',show:true},
            {prop:'chapterName',label:'所属章节',width:'140',show:true},
          ],
          failData: [],
          tableData: [],
          editTable: {
            id: '',
            typeId: '',
            typeName: '',
            stem: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            answer: '',
            keyword: '',
            curriculumId: '',
            curriculumName: '',
            chapterId: '',
            chapterName: '',
            difficulty: '',
          },
          selectIndex: '',
          addForm: {
            typeId: '',
            stem: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            answer: '',
            keyword: '',
            curriculumId: '',
            chapterId: '',
            difficulty: null,
          },
          multipleSelection: [],
          search: '',
          typeInfo: [],
          chapterInfo: [],
          curriculumInfo: [],
          userInfo:{
            username: this.$cookieStore.getCookie('username'),
            option: this.$cookieStore.getCookie('option'),
            page: '',
            count: ''
          },
          questionInfo:{
            id: [],
            option: this.$cookieStore.getCookie('option'),
            username: this.$cookieStore.getCookie('username')
          },
          formLabelWidth: '80px',
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
            stem: [
              { required: true, message: '请输入题干', trigger: 'blur' }
            ],
            answer: [
              { required: true, message: '请输入答案', trigger: 'blur' }
            ],
            difficulty: [
              { type: 'number',min: 1, message: '请选择难度'}
            ],
            curriculumId: [
              { required: true, message: '请选择所属课程', trigger: 'change' }
            ],
            typeId: [
              { required: true, message: '请选择题型', trigger: 'change' }
            ],
            chapterId: [
              { required: true, message: '请选择所属章节', trigger: 'change' }
            ],
          }
        }
      },
      created(){
        this.questionInit(this.page,this.pageSize);
      },
      methods: {
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
        //下载题库上传模板
        handleDownload() {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = [
              '(必填)题库教师编号(例:文本0200001)',
              '(必填)题库教师',
              '(必填)题库班级(只能填写一个)',
              '(必填)题库课程',
              '(必填)开始题库日期(例:文本2001-01-01)',
              '(必填)结束题库日期(例:文本2001-09-12)',
            ];
            excel.export_json_to_excel({
              header: tHeader,
              data: [],
              filename: '题库信息上传模板'
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
          console.log(results);
          const questionList = [];
          results.forEach((item, index) => {
            const question = {};
            Object.keys(item).forEach((key) => {
              if (key === '(必填)题库教师编号(例:文本0200001)') {
                question.teachId = (String)(item[key])
              }
              if (key === '(必填)题库教师') {
                question.teacherName = (String)(item[key])
              }
              if (key === '(必填)题库班级(只能填写一个)') {
                question.className = (String)(item[key])
              }
              if (key === '(必填)题库课程') {
                question.curriculumName = (String)(item[key])
              }
              if (key === '(必填)开始题库日期(例:文本2001-01-01)') {
                question.startTime = (String)(item[key])
              }
              if (key === '(必填)结束题库日期(例:文本2001-09-12)') {
                question.endTime = (String)(item[key])
              }
            });
            console.log(question);
            questionList.push(question)
          });
          this.insertQuestionInfoList(questionList)
        },
        // 插入数据库题库信息表
        async insertQuestionInfoList(questionList) {
          questionApi.uploadQuestion(questionList).then(res=>{
            if (res.code === '200') {
              this.tableHeader = [
                {prop:'teachId',label:'教师编号',width:'120'},
                {prop:'teacherName',label:'教师姓名',width:'130'},
                {prop:'curriculumName',label:'课程名称',width:'130'},
                {prop:'className',label:'班级名称',width:'140'},
                {prop:'startTime',label:'开始时间',formatter:this.timestampToTime,width:'140'},
                {prop:'endTime',label:'结束时间',formatter:this.timestampToTimeEnd,width:'140'},
                {prop:'key',label:'上传失败原因',width:'240'}];
              this.failData = res.data.responseList[0];
              this.allCount = res.data.allCount;
              this.successCount = res.data.successCount;
              this.failCount = res.data.failCount;
              this.tableData = [];
              this.questionInit(this.page,this.pageSize);
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
        //初始化题库题目信息
        questionInit(page,count){
          this.userInfo.page = page;
          this.userInfo.count = count;
          questionApi.questionInit(this.userInfo).then(res=>{
            for(let i in res.list){
              this.tableData.push(res.list[i]);
            }
            this.total = res.total;
            this.loading = false;
          });
          //获取题型信息
          questionApi.typeInfo().then(res=>{
            this.typeInfo = [];
            for(let i in res){
              this.typeInfo.push(res[i]);
            }
          });
          //获取课程信息
          manageApi.curriculumInfo(this.userInfo).then(res=>{
            this.curriculumInfo = [];
            for(let i in res){
              this.curriculumInfo.push(res[i]);
            }
          });
          //获取章节信息
          questionApi.chapterInfo().then(res=>{
            this.chapterInfo = [];
            for(let i in res){
              this.chapterInfo.push(res[i]);
            }
          });
        },
        //通过题型编号查询题型名称
        typeByName(id){
          for(let col in this.typeInfo){
            if(this.typeInfo[col].id === id){
              return this.typeInfo[col].name;
            }
          }
        },
        //通过课程编号查询课程名称
        curriculumByName(id){
          for(let col in this.curriculumInfo){
            if(this.curriculumInfo[col].id === id){
              return this.curriculumInfo[col].name;
            }
          }
        },
        //通过章节编号查询章节名称
        chapterByName(id){
          for(let col in this.chapterInfo){
            if(this.chapterInfo[col].id === id){
              return this.chapterInfo[col].name;
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
        //显示修改题库对话框
        editForm(index, rows){
          this.editTable.questionDate = [];
          this.dialogFormVisible = true;
          this.$refs.multipleTable.toggleRowSelection(rows[index]);
          this.editTable.id = rows[index].id;
          this.editTable.typeId = rows[index].typeId;
          this.editTable.typeName = rows[index].typeName;
          this.editTable.stem = rows[index].stem;
          this.editTable.answer = rows[index].answer;
          this.editTable.curriculumId = rows[index].curriculumId;
          this.editTable.curriculumName = rows[index].curriculumName;
          this.editTable.chapterId = rows[index].chapterId;
          this.editTable.chapterName = rows[index].chapterName;
          this.editTable.difficulty = rows[index].difficulty;
          if(this.editTable.typeId === 1 || this.editTable.typeId === 5){
            this.editTable.optionA = rows[index].optionA;
            this.editTable.optionB = rows[index].optionB;
            this.editTable.optionC = rows[index].optionC;
            this.editTable.optionD = rows[index].optionD;
          }
          if(this.editTable.typeId === 4){
            this.editTable.keyword = rows[index].keyword;
          }
          this.selectIndex = index;
        },
        //修改
        editRow(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              questionApi.editQuestion(this.$refs[formName].model).then(res=>{
                this.$notify({
                  title: '修改提示',
                  message: res.msg,
                  type: res.code === '200'?'success':'error',
                  duration: 4000
                });
                this.tableData[this.selectIndex].typeId = this.editTable.typeId;
                this.tableData[this.selectIndex].typeName = this.typeByName(this.editTable.typeId);
                this.tableData[this.selectIndex].curriculumId = this.editTable.curriculumId;
                this.tableData[this.selectIndex].curriculumName = this.curriculumByName(this.editTable.curriculumId);
                this.tableData[this.selectIndex].chapterId = this.editTable.chapterId;
                this.tableData[this.selectIndex].chapterName = this.chapterByName(this.editTable.chapterId);
                this.tableData[this.selectIndex].stem = this.editTable.stem;
                this.tableData[this.selectIndex].answer = this.editTable.answer;
                this.tableData[this.selectIndex].difficulty = this.editTable.difficulty;
                if(this.editTable.typeId === 1 || this.editTable.typeId === 5){
                  this.tableData[this.selectIndex].optionA = this.editTable.optionA;
                  this.tableData[this.selectIndex].optionB = this.editTable.optionB;
                  this.tableData[this.selectIndex].optionC = this.editTable.optionC;
                  this.tableData[this.selectIndex].optionD = this.editTable.optionD;
                }
                if(this.editTable.typeId === 4){
                  this.tableData[this.selectIndex].keyword = this.editTable.keyword;
                }
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
          this.$confirm('此操作将会删除属于该题库信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log()
            this.questionInfo.id = [];
            this.questionInfo.id.push(rows[index].id);
            questionApi.deleteQuestion(this.questionInfo).then(res=>{
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
          this.questionInfo.id = [];
          const selectData = this.$refs.multipleTable.selection;
          //得到所选行的公告编号
          for(let i in selectData){
            this.questionInfo.id.push(selectData[i].id);
          }
          if(selectData.length !== 0){
            var mess = '已取消删除';
            this.$confirm('此操作将会删除属于该题库信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              questionApi.deleteQuestion(this.questionInfo).then(res=>{
                mess = res.msg;
                if(res.code === '200'){
                  //删除所选行
                  selectData.forEach((val, index) => {
                    this.tableData.forEach((v, i) => {
                      // id 是每一行的数据id
                      if(val.teacherId === v.teacherId && val.classId === v.classId &&
                        val.curriculumId === v.curriculumId){
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
        //增加题库
        addQuestion(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              questionApi.addQuestion(this.$refs[formName].model).then(res=>{
                if(res.code === '200'){
                  this.resetForm(formName);
                  this.tableData = [];
                  this.questionInit(this.page,this.pageSize);
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
          this.questionInit(this.page,val);
        },
        //点击切换页面按钮
        switchPage(val) {
          this.tableData = [];
          this.questionInit(val,this.pageSize);
          this.loading = true;
        },
      }
    }
</script>

<style>
  .question{
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
