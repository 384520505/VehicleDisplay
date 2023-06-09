<template>
    <div class="container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>状态显示</span>
                    <span>按钮/命令</span>
                </div>
            </template>
            <el-row>
                <el-row style="margin-bottom: 1rem;">
                    <el-input class="searchBox" v-model="newMapID" placeholder="输入地图编号" />
                    <!-- <el-input style="margin: 0 1rem;" class="searchBox" v-model="newPathID" placeholder="输入路径编号" /> -->
                    <el-input style="margin: 0 1rem;" class="searchBox" v-model="newVehicleID" placeholder="输入车辆名称" /> 
                    <el-input class="searchBox" v-model="newDeviceID" placeholder="输入设备编号" /> 
                </el-row>
                <el-col :span="14">
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >地图:</span>
                        <el-input class="el-input" v-model="mapID" label disabled />
                    </el-row>
                    <!-- <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >路径号:</span>
                        <el-input class="el-input" v-model="pathID" label disabled />
                    </el-row> -->
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >车辆名称:</span>
                        <el-input class="el-input" v-model="vehicleID" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >经度:</span>
                        <el-input class="el-input" v-model="longitude" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >纬度:</span>
                        <el-input class="el-input" v-model="latitude" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >航向角:</span>
                        <el-input class="el-input" v-model="direction" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >车速:</span>
                        <el-input class="el-input" v-model="speed" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >舵角:</span>
                        <el-input class="el-input" v-model="rudderAngle" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >车辆状态:</span>
                        <el-input class="el-input" v-model="vehicleStatus" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >设备状态:</span>
                        <el-input class="el-input" v-model="deviceStatus" label disabled />
                    </el-row>
                    <el-row class="statuslist">
                        <span class="ml-3 w-35 text-gray-600 inline-flex items-center"
                        >设备开度:</span>
                        <el-input class="el-input" v-model="deviceLevel" label disabled />
                    </el-row>
                </el-col>
                <el-col :span="10">
                    <div class="buttonlist"><el-button type="primary" @click="involve">导入</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="vehicleSwitch">启动/停止</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operSpeed(1)">加速</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operSpeed(0)">减速</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operRudderAngle(1)">左舵</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operRudderAngle(0)">右舵</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="deviceSwitch">作业/结束</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operDirection(1)">加大开度</el-button></div>
                    <div class="buttonlist"><el-button type="primary" @click="operDirection(0)">减小开度</el-button></div>
                    
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>

import { 
    getWorkPath, 
    getVehicleStatus, 
    updataVehicleStatus, 
    getVehicleCmd, 
    updateVehicleCmd,
    getDeviceStatus,
    updataDeviceStatus,
    getMap
} from '../js/Ajax.js';
import { ElMessage, ElLoading } from 'element-plus';
// import { bus } from '../js/EventBus.js'

export default {
    data() {
        return {
            mapID:"",
            // pathID: "",
            vehicleID: "",
            deviceID:'',
            longitude: '',
            latitude: '',
            altitude:'',
            direction: '', //航向角
            speed: '',
            rudderAngle: '', //舵角
            vehicleStatus: '',
            vehicleStatusID: 0,
            deviceStatus: '',
            deviceStatusID: 0,
            deviceLevel:'', //设备开度
            

            newMapID:'',
            // newPathID:'',
            newVehicleID:'',
            newDeviceID:'',

            isInto: false,

            timer:'',
            
        }
    },

    created(){
       
    },

    computed: {
    },

    mounted(){
        this.updataData();
        // this.watchAndUpdata();
    },

    // 帧听器
    watch:{
    },

    methods:{
        async involve(){
            this.isInto = false;
            if(!this.checkForm()) return;
            let loading = ElLoading.service({
                text:"Loading..."
            });
            // 获取地图
            let mapArr = await getMap(this.newMapID);
            if(!mapArr){
                this.mapID = '';
                ElMessage({
                    message: `编号为${this.newMapID}的地图不存在！！！`,
                    type: 'warning',
                })
            }else{
                this.mapID = this.newMapID;
                // 更新查询的地图编号
                this.updataMapID();
            }

            // 获取工作路径
            // let workPath = this.findWorkPath(this.newPathID, mapArr);
            // if(workPath){
            //     this.pathID = this.newPathID;
            // }else{
            //     this.pathID = '';
            // }

            // 获取车辆状态
            let vehicle = await getVehicleStatus(this.newVehicleID);
            if(!vehicle){
                ElMessage({
                    message: `${this.newVehicleID}车辆不存在！！！`,
                    type: 'warning',
                })
                this.vehicleID = '';
                this.longitude = '';
                this.latitude = '';
                this.direction = '';
                this.speed = '';
                this.rudderAngle = '';
            }else{
                const { name, longitude, latitude, direction, altitude, rudderAngle, speed } = vehicle;
                this.vehicleID = name;
                this.longitude = longitude.toFixed(7);
                this.latitude = latitude.toFixed(7);
                this.altitude = altitude.toFixed(7);
                this.direction = (direction/180*100).toFixed(2) + '%';
                this.speed = speed;
                this.rudderAngle = (rudderAngle/180*100).toFixed(2) + '%';
            }

            // 通过车辆的速度判断车辆的启动和停止状态
            if(this.speed*1 > 0) this.vehicleStatus = '启动';
            else this.vehicleStatus = '停止';
            // 获取车辆控制命令
            // 获取到原始的 控制指令 数据
            // let originalCtrData = await getVehicleCmd(this.vehicleID);
            // let originalCtrDataArr = originalCtrData.cmd.split(',');
            // if(!originalCtrDataArr || originalCtrDataArr.length != 7){
            //     this.vehicleStatus = '0';
            //     ElMessage({
            //         message: `获取的控制数据不符合规范！！！`,
            //         type: 'warning',
            //     })
            // }else{
            //     const cmd = originalCtrDataArr[0]*1;
            //     if(cmd == 0) this.vehicleStatus = "0";
            //     if(cmd == 1) this.vehicleStatus = "启动";
            //     if(cmd == 2) this.vehicleStatus = "关闭";
            // }

            // 获取设备状态，数据结构： "1,2"  1表示设备启停状态，2表示设备开度
            let device = await getDeviceStatus(this.newDeviceID);
            let originalDeviceStatus = device.split(',');
            
            if(!device){
                this.deviceStatus = '';
                this.deviceID = '';
                ElMessage({
                    message: `${this.newDeviceID}设备不存在！！！`,
                    type: 'warning',
                })
            }else{
                if(originalDeviceStatus[0]*1 === 0) this.deviceStatus = 0;
                if(originalDeviceStatus[0]*1 === 1) this.deviceStatus = '作业';
                if(originalDeviceStatus[0]*1 === 2) this.deviceStatus = '结束';
                this.deviceID = this.newDeviceID;
                this.deviceLevel = originalDeviceStatus[1];
            }

            this.isInto = true;
            loading.close();
            
        },
        updataData(){
            this.timer = setInterval(async () => {
                if(!this.isInto) return;
                // if(this.mapID){
                //     let mapArr = await getWorkPath(this.mapID);
                //     if(this.pathID){

                //     }
                // }
                if(this.vehicleID){
                    let vehicle = await getVehicleStatus(this.vehicleID);
                    const { name, longitude, latitude, direction, altitude, rudderAngle, speed } = vehicle;
                    this.vehicleID = name;
                    this.longitude = longitude.toFixed(7);
                    this.latitude = latitude.toFixed(7);
                    this.altitude = altitude.toFixed(7);
                    this.direction = (direction/180*100).toFixed(2) + '%';
                    this.speed = speed;
                    this.rudderAngle = (rudderAngle/180*100).toFixed(2) + '%';

                    // 通过车辆的速度判断车辆的启动停止状态
                    if(this.speed*1 > 0) this.vehicleStatus = '启动';
                    else this.vehicleStatus = '停止';

                    // 获取到原始的 控制指令 数据
                    // let  originalCtrData = await getVehicleCmd(this.vehicleID);
                    // let originalCtrDataArr = originalCtrData.cmd.split(',');

                    // const cmd = originalCtrDataArr[0]*1;
                    // if(cmd == 0) this.vehicleStatus = "0";
                    // if(cmd == 1) this.vehicleStatus = "启动";
                    // if(cmd == 2) this.vehicleStatus = "关闭";
                    
                }
                if(this.deviceID){
                    let device = await getDeviceStatus(this.newDeviceID);
                    console.log(device)
                    let originalDeviceStatus = device.split(',');
                    if(originalDeviceStatus[0]*1 === 0) this.deviceStatus = 0;
                    if(originalDeviceStatus[0]*1 === 1) this.deviceStatus = '作业';
                    if(originalDeviceStatus[0]*1 === 2) this.deviceStatus = '结束';
                    this.deviceLevel = originalDeviceStatus[1];
                }
            }, 1000);
        },

        // 地图数据变更时，自动上传到服务器
        // watchAndUpdata(){
        //     // 监听OperateCSV组件传递过来的数据
        //     bus.on('mapId', async (data) => {
        //         console.log(data);
        //         if(!this.vehicleID) return;
        //         let  originalCtrData = await getVehicleCmd(this.vehicleID);
        //         let originalCtrDataArr = originalCtrData.cmd.split(',');
        //         // 判断获取到的数据是否符合规范
        //         if(!originalCtrDataArr || originalCtrDataArr.length != 7){
        //             ElMessage({
        //                 message:'获取的控制数据不符合规范！',
        //                 type:'warning'
        //             });
        //             return;
        //         }
        //         originalCtrDataArr[2] = data;
        //         let CtrDataArr = originalCtrDataArr.join(',');
                
        //         const res = await updateVehicleCmd({
        //             target: this.vehicleID,
        //             cmd:CtrDataArr
        //         });
        //         console.log(res);
        //     })
        // },


        /**
         * 对于车辆的开关状态、设备的开关状态、地图编号、车辆速度、车辆航向角、设备控制等级
         * 原始车辆控制接口中 cmd字段的数据是一个字符串，其中1-6个数据按顺序排列，
         * 分别表示：车辆的开关状态、设备的开关状态、地图编号、车辆速度、车辆航向角、设备控制等级
         */
        async operSpeed(sign){
            // if(!this.speed){
            //     ElMessage({
            //         message:'未获取到当前速度值！',
            //         type:'warning'
            //     });
            //     return;
            // }
            // 获取到原始的 控制指令 数据
            let originalCtrData = await getVehicleCmd(this.vehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 6){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }
            // 修改速度值
            if(sign === 1) originalCtrDataArr[3] = originalCtrDataArr[3]*1 + 1;
            if(sign === 0) originalCtrDataArr[3] = originalCtrDataArr[3]*1 - 1;

            // 将数组转为字符串
            let CtrDataArr = originalCtrDataArr.join(',');
            
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });
            
            console.log(res);
        },
        async operRudderAngle(sign){
            // if(!this.rudderAngle){
            //     ElMessage({
            //         message:'未获取到当前舵角值！',
            //         type:'warning'
            //     });
            //     return;
            // }
            
            // 获取到原始的 控制指令 数据
            let  originalCtrData = await getVehicleCmd(this.vehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 6){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }

            // 修改舵角值
            if(sign === 1) originalCtrDataArr[5] = originalCtrDataArr[5]*1 + 1;
            if(sign === 0) originalCtrDataArr[5] = originalCtrDataArr[5]*1 - 1;

            let CtrDataArr = originalCtrDataArr.join(',');
            
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });
            console.log(res);
        },
        async operDirection(sign){
            // if(!this.direction){
            //     ElMessage({
            //         message:'未获取到当前航向角值！',
            //         type:'warning'
            //     });
            //     return;
            // }
            // 获取到原始的 控制指令 数据
            let  originalCtrData = await getVehicleCmd(this.vehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 6){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }

            // 修改方向值
            if(sign === 1) originalCtrDataArr[4] = originalCtrDataArr[4]*1 + 1;
            if(sign === 0) originalCtrDataArr[4] = originalCtrDataArr[4]*1 - 1;

            let CtrDataArr = originalCtrDataArr.join(',');
            
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });
            
            // let res = await updataVehicleStatus({
            //     latitude: this.latitude,
            //     longitude: this.longitude,
            //     altitude: this.altitude,
            //     direction: this.direction,
            //     speed: this.speed,
            //     rudderAngle: this.rudderAngle,
            //     name: this.vehicleID
            // });
            console.log(res);
        },
        async vehicleSwitch(){
            // if(!this.vehicleStatus){
            //     ElMessage({
            //         message:'未获取到当前车辆状态值！',
            //         type:'warning'
            //     });
            //     return;
            // }

            // 获取到原始的 控制指令 数据
            let  originalCtrData = await getVehicleCmd(this.vehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 6){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }

            if(originalCtrDataArr[0]*1 === 0){
                originalCtrDataArr[0] = 1;
            }
            if(originalCtrDataArr[0]*1 === 1){
                originalCtrDataArr[0] = 2;
            }else if(originalCtrDataArr[0]*1 === 2){
                originalCtrDataArr[0] = 1;
            }

            let CtrDataArr = originalCtrDataArr.join(',');
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });

            console.log(res);
        },
        async deviceSwitch(){
            // if(!this.deviceStatus){
            //     ElMessage({
            //         message:'未获取到当前设备状态值！',
            //         type:'warning'
            //     });
            //     return;
            // }
            // 获取到原始的 控制指令 数据
            let  originalCtrData = await getVehicleCmd(this.vehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 7){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }

            if(originalCtrDataArr[1]*1 === 0){
                originalCtrDataArr[1] = 1;
            }
            if(originalCtrDataArr[1]*1 === 1){
                originalCtrDataArr[1] = 2;
            }else if(originalCtrDataArr[1]*1 === 2){
                originalCtrDataArr[1] = 1;
            }

            let CtrDataArr = originalCtrDataArr.join(',');
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });
            console.log(res);
        },

        // 更新地图到控制指令接口中
        async updataMapID(){
            // 获取旧的控制指令数据
            // 获取到原始的 控制指令 数据
            let originalCtrData = await getVehicleCmd(this.newVehicleID);
            let originalCtrDataArr = originalCtrData.cmd.split(',');
            // 判断获取到的数据是否符合规范
            if(!originalCtrDataArr || originalCtrDataArr.length != 6){
                ElMessage({
                    message:'获取的控制数据不符合规范！',
                    type:'warning'
                });
                return;
            }
            originalCtrDataArr[2] = this.newMapID;
            let CtrDataArr = originalCtrDataArr.join(',');
            const res = await updateVehicleCmd({
                target: this.vehicleID,
                cmd:CtrDataArr
            });
            console.log('updateMapID',res);
            
        },
        // findWorkPath(workPathID, mapArr){
        //     if(!mapArr) return;
        //     let workPath = mapArr.filter(item=>{
        //         if(!item || !item.id) return;
        //         if(item.id === workPathID) return item;
        //         return ;
        //     });
        //     if(workPath.length === 0){
        //         ElMessage({
        //             message: `此地图中不存在编号为${this.workPathID}的路径！！！`,
        //             type: 'warning',
        //         })
        //         return ;
        //     }
        //     return workPath[0];
        // },
        checkForm(){
            if(!this.newMapID || !this.newVehicleID || !this.newDeviceID){
                if(!this.newMapID) ElMessage.error('请输入正确的地图编号！！！');
                // if(!this.newPathID) ElMessage.error('请输入正确的路径编号！！！');
                if(!this.newVehicleID) ElMessage.error('请输入正确的车辆名称！！！');
                if(!this.newDeviceID) ElMessage.error('请输入正确的设备编号！！！');
                return false;
            }
            return true;
        }
    }
    
}
</script>

<style lang="less">
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 100%;
    font-size: 1rem;
    .searchBox{
        display: inline-block;
        flex: 1;
    }
    .statuslist {
        display: flex;
        justify-content: space-between;
        height: 32px;
        margin-top: 1rem;
        .el-input{
            width: 12rem;
            input{
                -webkit-text-fill-color: black
            }
        }
    }

    .buttonlist {
        margin-top: 1rem;
        text-align: right;
        button, div{
            width: 150px;
        }
    }
}
.lineshow{
    display: inline;
}
</style>