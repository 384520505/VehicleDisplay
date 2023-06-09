<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>路径/地图显示、作业区段指定</span>
            </div>
        </template>
        <div class="mapGraphice">
            <div id="map"></div>
        </div>
    </el-card>
</template>

<script>
export default {
    mounted() {
        // this.setMap();
    },
    methods: {
        setMap() {
            // var map = L.map('map').setView([51.505, -0.09], 13);
            // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);

            // L.marker([51.5, -0.09]).addTo(map)
            //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            //     .openPopup();
            var map = L.map('map').setView([40, 116], 5);

            var coordinates = [
                [ 34.1274, 120.2374 ],  
                [ 35.9375, 121.8364 ],  
                [ 36.38456, 123.7264 ],  
                [ 40.7263, 125.3651 ],  
                [ 45.2732, 129.2523 ],  
                [ 55.2633, 134.47437 ]
            ];
            var coordinates1 = [
                [ 34.1274, 120.2374 ],  
                [ 40.27643, 100.364 ],  
                [ 41.38456, 90.7264 ]
            ];

            var polyline = L.polyline(coordinates, {color: 'blue'}).addTo(map);
            var polyline = L.polyline(coordinates1, {color: 'red'}).addTo(map);
        }
    }
}
</script>

<style lang="less">
.mapGraphice {
    #map {
        height: 500px;
    }
}
</style>