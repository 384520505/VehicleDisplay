// 起点标记点
const Start_Icon = (AMap)=>{
    return new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(25, 34),
        // 图标的取图地址
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        // 图标所用图片大小
        imageSize: new AMap.Size(135, 40),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(-9, -3),
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move',
    });
}
// 终点标记点
const Termius_Icon = (AMap)=>{
    return new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
        imageSize: new AMap.Size(135, 40),
        imageOffset: new AMap.Pixel(-95, -3),
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move',
    });
}
// 路经标记点
const Via_Icon = (AMap)=>{
    return new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
        imageSize: new AMap.Size(25, 34),
        imageOffset: new AMap.Pixel(0, 0),
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move',
    });
}
// 车标记点
const Car_Icon = (AMap)=>{
    return new AMap.Icon({
        size: new AMap.Size(25, 34),
        image: '//a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
        imageSize: new AMap.Size(25, 34),
        imageOffset: new AMap.Pixel(0, 0),
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move',
    });
}

export {
    Start_Icon,
    Termius_Icon,
    Via_Icon,
    Car_Icon
}