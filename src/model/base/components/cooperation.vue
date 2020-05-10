<template>
  <div style="height: 80px;background-color: #f6f7ff">
    <center>
      <marquee align="center" behavior="scroll" direction="left"
               vspace="15" scrolldelay="300"
               onmouseout="this.start()" onmouseover="this.stop()">
        <font size=3 face="黑体" >
          <van-row gutter="20">
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #b8fae9">伙伴</div>
            </van-col>
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #dcfdce">伙伴</div>
            </van-col>
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #efffb3">伙伴</div>
            </van-col>
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #d2ecff">伙伴</div>
            </van-col>
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #a2cbff">伙伴</div>
            </van-col>
            <van-col span="4">
              <div style="width: 50px;height:50px;background-color: #f1d2ff">伙伴</div>
            </van-col>
          </van-row>
        </font>
      </marquee>
    </center>
  </div>

</template>

<script>
    export default {
        name: "cooperation-com",
      data(){
          return {
            name: "cooperation-com"
          }
      }
    }
</script>

<style scoped>
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>
