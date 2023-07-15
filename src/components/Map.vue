<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>路径/地图显示、作业区段指定</span>
            </div>
        </template>
        <div class="mapGraphice">
            <div id="container"></div>
            <div id="panel"></div>
        </div>
    </el-card>
</template>

<script>
import { AMapObj, Location, ConvertFrom, DataTransfrom, ArrDisasseTool } from '../js/tools.js'
import { Start_Icon, Termius_Icon, Via_Icon, Car_Icon } from '../js/Icon.js'
import { shallowRef } from '@vue/reactivity';
import { ElMessage, ElLoading } from 'element-plus';
import Marker from '../class/Marker.js';
import { getMap, getFunctionPoints } from '../js/Ajax.js';
import { DownLoad_MapID } from '../js/Constant.js';
import { bus } from '../js/EventBus.js';
export default {
    data() {
        return {
            // 用来显示地图路线的编号
            mapID:null,
            // 路线列表
            PolylineList:[],
        }
    },
    // 这里是vue3的特定用法，需要与vue2进行区别
    setup() {
        const MapObj = shallowRef(null);
        const AMapObj = shallowRef(null);
        return {
            MapObj,
            AMapObj,
        }
    },
    mounted() {
        this.initMap();
    },
    methods: {
        // 初始化地图
        async initMap() {
            // 显示加载
            let loading = ElLoading.service({
                text:"Loading..."
            });

            
            await AMapObj()
            .then(async AMap => {
                // 创建卫星图层
                const satellite = new AMap.TileLayer.Satellite();
                // 创建网路
                const roadNet = new AMap.TileLayer.RoadNet();
                this.AMapObj = AMap;
                this.MapObj = new AMap.Map('container',{
                    resizeEnable: true,
                    zoom: 15,
                    // center:[87.565923,43.810112],
                    center:[116.281498, 39.940666],
                    layers:[
                        satellite,
                        roadNet
                    ]
                });
                // 地图加载完毕
                this.MapObj.on('complete', ()=>{
                    loading.close();
                })
                // 添加点击事件
                this.MapObj.on('click', (event)=>{
                    console.log(event.lnglat.getLng(), event.lnglat.getLat());
                })
                // 添加工具条插件
                const Toolbar = new AMap.ToolBar();
                this.MapObj.addControl(Toolbar);
                // add scale plugin
                const Scale = new AMap.Scale();
                this.MapObj.addControl(Scale);
                // 获取定位
                // this.makeLocate(AMap);

                // 添加标记点
                // this.addMarker(new AMap.LngLat(87.565923,43.810112), '乌鲁木齐', Via_Icon(AMap));

                // 添加车 39.9421013， 116.2786158

                const transformPos = await ConvertFrom(AMap, [116.2786158,39.9421013]);
                const car = this.addMarker(transformPos.locations[0], 'car', Start_Icon(AMap));
                this.moveMonit(car);
                // 添加线路
                this.addRoad();
                // 添加多边形
                // this.addPolygon();
                // 路径规划
                // const startLngLat = [87.565985, 43.809772];
                // const endLngLat = [87.566703, 43.809923];
                // this.routePlan(startLngLat, endLngLat);

                
            })
            .catch(err => {
                console.log(err);
                ElMessage({
                    message: '地图初始化失败！！！',
                    type: 'error',
                })
            })
        },

        // 进行定位
        makeLocate(AMap){
            const geolocation = Location(AMap);
            this.MapObj.addControl(geolocation);
            geolocation.getCurrentPosition((status, res) => {
                console.log(status);
                console.log(res);
            });
        },

        // 添加标记点
        addMarker(LngLat, label, Icon){
            const marker = new Marker({
                AMap, 
                LngLat, 
                label,
                Icon
            }).Init();
            this.MapObj.add(marker);
            return marker;
        },

        // 添加线路（请求获取的路线）
        addRoad(){
            bus.on('mapID', async (mapID)=>{
                this.clearRoad();
                this.mapID = mapID;
                // 获取地图
                const map = await getMap(mapID);
                const mapData = DataTransfrom(map, DownLoad_MapID);
                let path = [];
                mapData.data.forEach((item, index)=>{
                    if(item.Longitude == 0 || item.Latitude == 0) ;
                    else path.push(new this.AMapObj.LngLat(item.Longitude, item.Latitude));
                });
                
                let pathArrs = ArrDisasseTool(path);
                pathArrs.forEach(async path=>{
                    const transformPath = await ConvertFrom(this.AMapObj, path);
                    if(transformPath.info != 'ok'){
                        ElMessage({
                            message: `路径显示失败！！！`,
                            type: 'error',
                        })
                    }

                    var polyline = new this.AMapObj.Polyline({
                        path: transformPath.locations,
                        strokeWeight: 3, // 线条宽度，默认为 1
                        strokeColor: 'red', // 线条颜色
                        lineJoin: 'round' // 折线拐点连接处样式
                    });

                    this.MapObj.add(polyline);
                    this.PolylineList.push(polyline);
                })
            });
        },


        // 添加多边形
        addPolygon(){
            const path = [
                new this.AMapObj.LngLat(87.573986, 43.812332),
                new this.AMapObj.LngLat(87.573996, 43.812308),
                new this.AMapObj.LngLat(87.572956, 43.812113),
                new this.AMapObj.LngLat(87.573139, 43.811641),
                new this.AMapObj.LngLat(87.574258, 43.81185),
                new this.AMapObj.LngLat(87.57408, 43.812348),
                new this.AMapObj.LngLat(87.573986, 43.812332)
            ];

            // 创建多边形 Polygon 实例
            const polygon = new this.AMapObj.Polygon({
                path: path,  
                strokeColor: "#FF33FF", 
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                fillColor: '#1791fc',
                zIndex: 50,
            });

            //多边形 Polygon对象添加到 Map
            this.MapObj.add(polygon);
            // 缩放地图到合适的视野级别
            this.MapObj.setFitView([ polygon ])
        },

        // 路径规划
        // startLngLat: [123.2345, 45.346]; endLngLat:[133.123453, 45.36456]
        routePlan(startLngLat, endLngLat){
            let driving = new this.AMapObj.Driving({
                // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                policy: this.AMapObj.DrivingPolicy.LEAST_TIME,
                map: this.MapObj,
                panel:'panel'
            })
            driving.search(startLngLat, endLngLat, (status, result)=>{
                console.log(status, result)
            })
        },

        // 运动监控
        moveMonit(marker){
            const timer = setInterval(async ()=>{
                // 获取运动物体的最新的位置（发送请求获取最新的坐标数据）
                if(!this.mapID){
                    console.log('地图编号为空！');
                    return;
                }
                const coords = await getFunctionPoints(this.mapID);
                if(!coords) return;
                // 解析出功能点编号为 vehicleRTcoord 的数据
                const vehicleRTcoord = coords.filter((item)=>{
                    return item.id === 'vehicleRTcoord';
                });
                const transformPos = await ConvertFrom(this.AMapObj, vehicleRTcoord[0].coordinates);
                if(transformPos.info === 'ok')
                // 更新位置及角度
                marker.setPosition(transformPos.locations[0]);
                // marker.setAngle(60); 
            }, 1000);
        },

        // 清楚路线
        clearRoad(){
            this.PolylineList.forEach((polyline) => {
                console.log('clearRoad---244', polyline);
                polyline.destroy();
            });
            this.PolylineList.length = 0;
        },
    
        
    }
}
</script>

<style lang="less">
.mapGraphice {
    #container {
        height: 500px;

        .amap-marker-label{
            border: 0;
            background-color: white;
            border-radius: 3px;
            padding: 6px 8px;
        }
    }
}
</style>