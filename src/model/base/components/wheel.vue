<template>
  <div >
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img  :src=image height="150px" width="100%" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
    export default {
      name:"wheel-com",
        data(){
          return {
            name:"wheel-com",
            images: [
              require('@/assets/image/1.jpg'),
              require('@/assets/image/2.jpg'),
              require('@/assets/image/3.jpg'),
            ],
          }
        }
    }
</script>

<style scoped>

</style>
