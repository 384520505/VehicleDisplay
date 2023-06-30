import axios from 'axios'
import { CameraUrl, AccessToken, CameraTokenUrl, StopContralUrl, StartContralUrl, DeviceSerial, AppKey, AppSecret } from './Constant.js'

const IP = "http://39.98.84.198:8080";
const workPath = "api/UGVService/ugv/getWorkPath/";
const vehicleStatus = "api/UGVService/ugv/getVehicle/";
const putVehicleStatus = "api/UGVService/ugv/updateVehicle";
const deviceStatus = "api/UGVService/ugv/getEquipment/";
const putDeviceStatus = "apiUGVService/ugv/updateEquipment";
const vehicleCmd = "api/UGVService/ugv/getCommand/";
const putVehicleCmd = "api/UGVService/ugv/putCommand";
const putMapPath = "api/UGVService/ugv/putMap";
const getMapPath = "api/UGVService/ugv/getMap/";


const putMap = (map)=>{
    return new Promise((resolve, reject)=>{
        axios.put(putMapPath, {
            ...map
        })
        .then(res=>{
            resolve(res);
        })
        .catch(err=>{
            reject(err);
        })
    });
}

const getMap = (id)=>{
    return new Promise((resolve, reject)=>{
        axios.get(`${getMapPath}${id}`)
        .then(res=>{
            resolve(res.data);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

// id 为地图编号， 返回一组路径
const getWorkPath = (id)=>{
    return new Promise((resolve, reject)=>{
        // let loading = ElLoading.service({
        //     text:"Loading..."
        // });
        axios.get(`${workPath}${id}`)
        .then(res=>{
            resolve(res.data);
            // loading.close();
        })
        .catch(err=>{
            reject(err);
            // loading.close();
        })
    });
}

const getVehicleStatus = (name)=>{
    return new Promise((resolve, reject)=>{
        // let loading = ElLoading.service({
        //     text:"Loading..."
        // });
        axios.get(`${vehicleStatus}${name}`)
        .then(res=>{
            resolve(res.data);
            // loading.close();
        })
        .catch(err=>{
            reject(err);
            // loading.close();
        });
    });
}

const updataVehicleStatus = (statusObj)=>{
    return new Promise((resolve, reject)=>{
        axios.put(putVehicleStatus, {
            ...statusObj
        })
        .then(res=>{
            resolve(res.data);
        })
        .catch(err=>{
            reject(err);
        })
    });
}

const getVehicleCmd = (name)=>{
    return new Promise((resolve, reject)=>{
        // let loading = ElLoading.service({
        //     text:"Loading..."
        // });
        axios.get(`${vehicleCmd}${name}`)
        .then(res=>{
            resolve(res.data);
            // loading.close();
        })
        .catch(err=>{
            reject(err);
            // loading.close();
        });
    });
}

const updateVehicleCmd = (cmdObj)=>{
    return new Promise((resolve, reject)=>{
        axios.put(putVehicleCmd,{
            ...cmdObj
        })
        .then(res=>{
            resolve(res.data);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

const getDeviceStatus = (id)=>{
    return new Promise((resolve, reject)=>{
        // let loading = ElLoading.service({
        //     text:'Loading...'
        // });
        axios.get(`${deviceStatus}${id}`)
        .then(res=>{
            resolve(res.data);
            // loading.close();
        })
        .catch(err=>{
            reject(err);
            // loading.close();
        });
    });
}

const updataDeviceStatus = (statusObj)=>{
    return new Promise((resolve, reject)=>{
        axios.put(putDeviceStatus, {
            ...statusObj
        })
        .then(res=>{
            resolve(res.data);
        })
        .catch(err=>{
            reject(err);
        });
    });
}


// 获取摄像头的token
const getCameraToken = ()=>{
    return new Promise((resolve, reject)=>{
        axios.post(CameraTokenUrl, {
            appKey: AppKey,
            appSecret: AppSecret
        },{
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(res=>{
            console.log('getCameraToken', res);
            resolve(res);
        })
        .catch(err=>{
            reject(err);
        });
    });
};

// 控制摄像头的方向
/* 操作命令：direction
		0-上，
		1-下，
		2-左，
		3-右，
		4-左上，
		5-左下，
		6-右上，
		7-右下，
		8-放大，
		9-缩小，
		10-近焦距，
		11-远焦距
	*/
const StopContral = (direction) => {
    return new Promise((resolve, reject) => {
        axios.post(StopContralUrl, {
            accessToken: AccessToken,
            deviceSerial: DeviceSerial,
            channelNo: 1,
            direction,
        },{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then(res=>{
            const {
                code,
                msg
            } = res.data;
            console.log(msg)
            if (code === '200') {
                resolve(msg)
            }
        })
        .catch(err=>{
            reject(err);
        });
    });
}

// 开始云台控制
/* 操作命令：direction
    0-上，
    1-下，
    2-左，
    3-右，
    4-左上，
    5-左下，
    6-右上，
    7-右下，
    8-放大，
    9-缩小，
    10-近焦距，
    11-远焦距
*/
const StartContral = (direction, speed) => {
    return new Promise((resolve, reject) => {
        axios.post(StartContralUrl, {
            accessToken: AccessToken,
            deviceSerial: DeviceSerial,
            channelNo: 1,
            direction,
            speed,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .then(res=>{
            console.log('StartContral', res);
            const {
                code,
                msg
            } = res.data;
            console.log(msg)
            if (code === '200') {
                resolve(msg)
            }
        })
        .catch(err=>{
            reject(err);
        });
    });
}


export {
    putMap,
    getMap,
    getWorkPath,
    getVehicleStatus,
    updataVehicleStatus,
    getVehicleCmd,
    updateVehicleCmd,
    getDeviceStatus,
    updataDeviceStatus,
    StartContral,
    StopContral,
    getCameraToken
}