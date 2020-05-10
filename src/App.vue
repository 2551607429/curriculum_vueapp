<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
    <!-- 导航 -->
<!--    <naviggation-com/>-->
  </div>
</template>

<script>
// import NaviggationCom from "./model/base/components/navigation";
export default {
  name: 'App',
  provide(){
    return{
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
  // components: {NaviggationCom}
}
</script>

<style>

</style>
