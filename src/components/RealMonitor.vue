<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>视频监控</span>
            </div>
        </template>
        <div class="monitor">
            <div id="video-container"></div>
        </div>
    </el-card>
</template>

<script>
import EZUIKit from 'ezuikit-js';
import { CameraUrl, AccessToken } from '../js/Constant.js'
export default{
    data(){
        return {
            monitor: '',
        }
    },

    mounted(){
        this.initVideo();
    },

    methods:{
        initVideo(){
            this.monitor = new EZUIKit.EZUIKitPlayer({
                id: 'video-container', // 视频容器ID
                accessToken: AccessToken,
                url: CameraUrl,
            })
        },

    }
}
</script>

<style lang="less">
.monitor{
    width: 100%;
    height: 400px;

    #video-container{
        width: 100%;
        height: 100%;
    }
}
</style>