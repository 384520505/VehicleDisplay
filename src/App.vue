<template >
  <div class="common-layout">
    <el-container>
      <el-header class="header">中控台</el-header>
      <el-main class="main">
        <!-- 上面的控制中心和地图显示 -->
        <el-row>
          <!-- <el-col :span="10">
            <StatusShow />
          </el-col>
          <el-col :span="1"></el-col> -->
          
          <!-- <el-col :span="24">
            <Map />
          </el-col> -->
          <el-col :span="24">
            <el-tabs
              v-model="activeName"
              type="card"
              class="shiftCard"
              @tab-click="handleClick"
            >
              <el-tab-pane label="视频监控" name="first"><RealMonitor /></el-tab-pane>
              <el-tab-pane label="地图" name="second"><Map /></el-tab-pane>
            </el-tabs>
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
import StatusShow from './components/StatusShow.vue'
import Map from './components/Map.vue'
import OperateCSV from './components/OperateCSV.vue'
import RealMonitor from './components/RealMonitor.vue'

export default {

  data() {
    return {
      loading: null,
      activeName: 'second'
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
  },
  methods:{
    handleClick(tab, event){
      // console.log(tab, event)
    },
  }
}
</script>

<style scoped lang="less">
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
