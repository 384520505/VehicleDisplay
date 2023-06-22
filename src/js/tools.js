import { ElMessage } from 'element-plus'
import Papa from 'papaparse'
import AMapLoader from '@amap/amap-jsapi-loader';
import { Key } from './Constant.js'


const FileToText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = e => {
            console.log("文件读取成功！--- tools, readAsText -> onload()");
            ElMessage({
                message: '读取成功！',
                type: 'success'
            });
            resolve(e.target.result);
        };
        reader.onerror = e => {
            console.log("文件读取失败！--- tools, readAsText -> onerror()");
            ElMessage.error("文件读取失败！");
            reject(e.target.error);
        }
    });
}

// 文件下载功能
const DownloadFile = (name, jsonData) => {
    // 先将json数据转为csv数据
    const content = Papa.unparse(jsonData);

    let elemento = document.createElement('a');
    let fileURL = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    elemento.href = fileURL;
    elemento.download = name;
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
}

// 加载AMapLoader对象
const AMapObj = () => {
    return new Promise((resolve, reject) => {
        AMapLoader.load({
            key: Key,       // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ['AMap.Geolocation', 'AMap.ToolBar', 'AMap.Scale','AMap.Marker', 'AMap.Driving', 'AMap.Walking', 'AMap.MoveAnimation'],
        })
            .then(AMap => {
                resolve(AMap);
            })
            .catch(err => {
                reject(err);
            })
    });
}

// 地图定位
const Location = (AMap) => {
    const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    return geolocation;
}




export {
    FileToText,
    DownloadFile,
    AMapObj,
    Location,
}