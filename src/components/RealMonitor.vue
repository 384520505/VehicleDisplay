<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>视频监控</span>
            </div>
        </template>
        <div class="monitor">
            <div id="video-container"></div>
            <div class="contral-btn">
                <el-button class="btn"
                    type="primary"
                    text
                    bg
                    @click="virControl(0)"
                >上</el-button>
                <el-button class="btn"
                    type="primary"
                    text
                    bg
                    @click="virControl(1)"
                >下</el-button>
                <el-button class="btn"
                    type="primary"
                    text
                    bg
                    @click="virControl(2)"
                >左</el-button>
                <el-button class="btn"
                    type="primary"
                    text
                    bg
                    @click="virControl(3)"
                >右</el-button>
            </div>
        </div>
    </el-card>
</template>

<script>
import EZUIKit from 'ezuikit-js';
import Cookies from 'js-cookie';
import { CameraUrl, AccessToken } from '../js/Constant.js';
import { StopContral, StartContral, getCameraToken } from '../js/Ajax.js';
export default{
    data(){
        return {
            monitor: '',
            camreaToken:''
        }
    },

    mounted(){
        this.initVideo();
    },

    methods:{
        async initVideo(){
            await this.getToken();
            this.monitor = new EZUIKit.EZUIKitPlayer({
                id: 'video-container', // 视频容器ID
                accessToken: this.camreaToken,
                url: CameraUrl,
                // 标准模版
                // template: 'security'
            })
        },
        // 获取摄像头的token并存储到cookie中
        async getToken(){
            const camreaToken = Cookies.get('camreaToken');
            if(camreaToken && new Date(camreaToken.expires) < new Date()){
                this.camreaToken = camreaToken;
                return;
            };
            await getCameraToken()
            .then(res=>{
                const { code, msg, data:{accessToken, expireTime} } = res.data;
                if(code === '200'){
                    this.camreaToken = accessToken;
                    Cookies.set('camreaToken', accessToken,{
                        expires: new Date(expireTime)
                    });
                }else{
                    console.log(msg);
                }
            })
            .catch(err=>{
                console.log(err);
            });
        },
        /**
         * direction: 控制方向
         * 0:左，
         * 1:上，
         * 2:右，
         * 3:下
         * */
        async virControl(direction){
            await StopContral(direction);
            await StartContral(direction, 2)
            .then(res=>{
                StopContral(direction);
            })
            .catch(error=>{
                console.log('云台控制失败！', error);
            })
        },

    }
}
</script>

<style scoped lang="less">
.monitor{
    width: 100%;
    height: 400px;
    position: relative;

    #video-container{
        position: absolute;
        width: 100% !important;
        height: 100% !important;
        #video-container-wrap{
            width: 100% !important;
            .video-containerparent-wnd > div{
                width: 100% !important;
                height: 100% !important;
            }
            #video-container-loading-id-0{
                height: 100% !important;
            }
        };
    }
    .contral-btn{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 0;
        z-index: 9999;
        height: 60px;
        width: 100%;
        background: rgba(255, 255, 255, 0.2);
        text-align: center;
        .btn{
            display: inline-block;
            // height: 40px;
            width: 50px;
            border-radius: 3px;
            background: white;
            padding: 4px 10px;
            margin: 0 8px;
        }
    }
}
</style>