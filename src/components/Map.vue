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
import { AMapObj, Location } from '../js/tools.js'
import { Start_Icon, Termius_Icon, Via_Icon, Car_Icon } from '../js/Icon.js'
import { shallowRef } from '@vue/reactivity';
import { ElMessage, ElLoading } from 'element-plus';
import Marker from '../class/Marker.js'
export default {
    /**
     * 87.571159 43.813519
     * 87.569313 43.819402
     * 87.559829 43.81804
     * 87.562213 43.811816
     * 87.571159 43.813519
     */
    data() {
        return {

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
            .then(AMap => {
                this.AMapObj = AMap;
                this.MapObj = new AMap.Map('container',{
                    resizeEnable: true,
                    zoom: 15,
                    center:[87.565923,43.810112]
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
                this.addMarker(new AMap.LngLat(87.565923,43.810112), '乌鲁木齐', Via_Icon(AMap));
                // 添加线路
                // this.addRoad();
                // 添加多边形
                // this.addPolygon();
                // 路径规划
                const startLngLat = [87.568573, 43.814814];
                const endLngLat = [87.57326, 43.818103];
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
        },

        // 添加线路
        addRoad(){
            const path = [
                new this.AMapObj.LngLat(87.571159, 43.813519),
                new this.AMapObj.LngLat(87.569313, 43.819402),
                new this.AMapObj.LngLat(87.559829, 43.81804),
                new this.AMapObj.LngLat(87.562213, 43.811816),
                new this.AMapObj.LngLat(87.571159, 43.813519)
            ];

            var polyline = new this.AMapObj.Polyline({
                path: path,  
                borderWeight: 3, // 线条宽度，默认为 1
                strokeColor: 'red', // 线条颜色
                lineJoin: 'round' // 折线拐点连接处样式
            });

            this.MapObj.add(polyline);
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