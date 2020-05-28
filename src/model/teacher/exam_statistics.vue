<template>
  <div class="statistics">
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 成绩分析</span>
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
    export default {
      name: "exam_statistics",
      data () {
        return {
          columns:[
            {prop:'examName',label:'班级名称',width:'140',show:true},
            {prop:'examName',label:'应考人数',width:'120',show:true},
            {prop:'className',label:'实考人数',width:'120',show:true},
            {prop:'username',label:'参考率',width:'120',show:true},
            {prop:'name',label:'及格率',width:'120',show:true},
            {prop:'score',label:'最高分',width:'120',show:true},
            {prop:'score',label:'最低分',width:'120',show:true},
            {prop:'score',label:'平均分',width:'120',show:true},
          ],
        }
      },
      mounted () {
        /*ECharts图表*/
        var myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          xAxis: {
            type: 'category',
            data: ['0', '6H', '9H', '12H', '15H', '18H', '24H']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [1, 3, 4, 7, 4, 6, 9],
            type: 'line'
          }]
        })

      },
      methods:{
      }
    }
</script>

<style>
  .statistics{
    background-color: #f5f7fa;
    margin-top: 60px;
    float: right;
    min-height: 580px;
    width: 84%;
    overflow:auto;
    z-index: -1;
  }
</style>
