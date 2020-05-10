<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text=""
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
  </div>
</template>

<script>
    export default {
      name:"listView-com",
       data(){
         return{
           name:"listView-com",
           list: ["焦点新闻","热门文章","教程教学","天下大事"],
           loading: true,
           finished: true
         }
       },methods: {
        onLoad(index) {
          // Notify({type: 'primary', message: index});
        },mounted(){

        }
      }
    }
</script>

<style scoped>

</style>
