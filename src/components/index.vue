<template>
 <div>
   <!-- 搜索 -->
   <search-com></search-com>
   <!-- 轮播图 -->
   <wheel-com></wheel-com>
   <!-- 通知 -->
   <notice-com></notice-com>
   <!-- 自定义 -->
   <custom-com></custom-com>
   <!-- 九宫格 -->
   <grid-com></grid-com>
   <!-- 自定义 -->
   <custom-com></custom-com>
   <!--    &lt;!&ndash; 合作单位 &ndash;&gt;-->
   <!--    <cooperation-com></cooperation-com>-->
   <!-- 热点 -->
   <list-view-com></list-view-com>
 </div>

</template>
<script>
  import SearchCom from "../model/base/components/search";
  import WheelCom from "../model/base/components/wheel";
  import NoticeCom from "../model/base/components/notice";
  import CustomCom from "../model/base/components/custom";
  import GridCom from "../model/base/components/grid";
  import CooperationCom from "../model/base/components/cooperation";
  import ListViewCom from "../model/base/components/listview";
  import NaviggationCom from "@/model/base/components/navigation";

  export default {
    name: "index-com",
    components: {ListViewCom, NaviggationCom, CooperationCom, GridCom, CustomCom, NoticeCom, WheelCom, SearchCom},
    data() {
      return {
        name:"index-com"
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }

</style>
