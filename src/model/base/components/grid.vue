<template>
  <div>
    <van-grid :column-num="3">
      <van-grid-item
        v-for="(item,index) in list"
        :key="index"
        :icon=item.icon
        :text=item.text :to="item.url" :url="item.url" :style="{color:item.color}"

      />
    </van-grid>
  </div>
</template>

<script>
    export default {
        name: "grid-com",
      data(){
          return{
            name: "grid-com",
            list:[
              {icon:'balance-o',text:"招商中心",url:"/xx",color:"black"},
              {icon:'friends-o',text:"合伙人中心",url:"/",color:"black"},
              {icon:'gem-o',text:"设计中新",url:"/",color:"black"},
              {icon:'bag-o',text:"素材中心",url:"/",color:"black"},
              {icon:'hot-o',text:"弘道商城",url:"/",color:"red"},
              {icon:'exchange',text:"流程中心",url:"/",color:"black"},
              {icon:'cashier-o',text:"科技创研",url:"/",color:"black"},
              {icon:'user-o',text:"私人定制",url:"/",color:"black"},
              {icon:'flower-o',text:"售后服务",url:"/",color:"black"},
            ]
          }
      }
    }
</script>

<style scoped>

</style>
