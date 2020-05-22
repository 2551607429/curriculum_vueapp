<template>
  <div>
    <exam_head></exam_head>
    <router-view></router-view>
  </div>
</template>

<script>
  import Exam_head from "../model/student/exam_head";
    export default {
      name: "examIndex",
      components: {
        Exam_head
      },
    }
</script>

<style scoped>
</style>
