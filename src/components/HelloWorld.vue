<template>
   <div>
     <head-com></head-com>
     <left-com></left-com>
     <router-view/>
   </div>
</template>

<script>

  import HeadCom from "../model/home/components/head";
  import LeftCom from "../model/home/components/left";


  import SearchCom from "../model/base/components/search";
  import WheelCom from "../model/base/components/wheel";
  import NoticeCom from "../model/base/components/notice";
  import CustomCom from "../model/base/components/custom";
  import GridCom from "../model/base/components/grid";
  import CooperationCom from "../model/base/components/cooperation";
  import ListViewCom from "../model/base/components/listview";
  import NaviggationCom from "@/model/base/components/navigation";
  import IndexCom from "./index";
  import Register from "../model/home/register";
  import StudentIndexCom from "../model/student/student_index";

  export default {
    name: "helloWorld-com",
    components: {
      Register,
      IndexCom,
      HeadCom,LeftCom,ListViewCom, NaviggationCom, CooperationCom, GridCom, CustomCom, NoticeCom, WheelCom, SearchCom
    },
    data() {
      return {
        name:"helloWorld-com"
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
