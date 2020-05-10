<template>
  <div>
    <van-row>
      <van-col span="18">
        <van-search v-model="value" placeholder="请输入搜索关键词" />
      </van-col>
      <van-col span="2" >
        <van-icon name="fire" color="red"  size="30" style="margin-top: 10px" />
      </van-col>
      <van-col span="2" >
        <van-icon name="chat-o" info="99+" size="30" style="margin: 10px 0 0 3px" />
      </van-col>
    </van-row>
  </div>
</template>

<script>
    export default {
        name: "search-com",
      data(){
          return{
           value:"text",
          name:'search-com'
          }
      }
    }
</script>

<style scoped>

</style>
