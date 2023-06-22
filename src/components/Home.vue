<template >
    <div class="common-layout">
      <el-container>
        <el-header class="header">中控台</el-header>
        <el-main class="main">
          <!-- 上面的控制中心和地图显示 -->
          <el-row>
            <el-col :span="10">
              <StatusShow />
            </el-col>
            <el-col :span="1"></el-col>
            <!-- <el-col :span="24">
              <Map />
            </el-col> -->
            <el-col :span="13">
              <RealMonitor />
            </el-col>
          </el-row>
          <!-- 下面的csv文件操作部分 -->
          <el-row style="margin-top: 1rem;">
            <el-col :span="10">
              <OperateCSV />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  import StatusShow from './StatusShow.vue'
  import Map from './Map.vue'
  import OperateCSV from './OperateCSV.vue'
  import RealMonitor from './RealMonitor.vue'
  
  export default {
  
    data() {
      return {
        loading: null
      }
    },
  
    beforeCreate() {
      console.log("DOM开始加载...");
      // this.loading = ElLoading.service({
      //   text:"Loading..."
      // })
    },
    mounted() {
      console.log('DOM结束加载...');
      // this.loading.close();
    }
  }
  </script>
  
  <style lang="less">
  .common-layout {
    .header {
      line-height: 60px;
      border-bottom: 1px solid #E5EAF3;
    }
  
  }
  
  .example-showcase .el-loading-mask {
    z-index: 9;
  }
  </style>
  