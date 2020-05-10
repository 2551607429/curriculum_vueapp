<template>
  <div>
    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item icon="home-o" @click="$router.push({name:'Index'})">首页</van-tabbar-item>
      <van-tabbar-item icon="search">商城</van-tabbar-item>
      <van-tabbar-item info="3" @click="$router.push({name:'my_center_page'})">
        <span>我的</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? icon.active : icon.inactive"
        >
      </van-tabbar-item>
      <!--      <van-tabbar-item icon="setting-o">标签4</van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>

<script>
  import { Notify } from 'vant';
    export default {
      name:"naviggation-com",
       data(){return{
         name:"naviggation-com",
         active: 0,
         icon: {
           active: 'https://img.yzcdn.cn/vant/user-active.png',
           inactive: 'https://img.yzcdn.cn/vant/user-inactive.png'},
       }},methods: {
        onChange(index) {

          // Notify({type: 'primary', message: index});
        },mounted(){

        }
      }
    }
</script>

<style scoped>

</style>
