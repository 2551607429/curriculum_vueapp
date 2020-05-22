<template>
   <div>
     <head-com></head-com>
     <left-com></left-com>
     <router-view/>
   </div>
</template>

<script>

  import HeadCom from "../model/common/head";
  import LeftCom from "../model/common/left";
  import Register from "../model/home/register";
  import StudentIndexCom from "../model/student/student_index";

  export default {
    name: "helloWorld-com",
    components: {
      Register,
      HeadCom,LeftCom
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
