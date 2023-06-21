
// 标记点类
class Marker {
    MarkerObj;

    // AMap: Object
    // LanLat:new AMap.LngLat(87.565923,43.810112), Object
    // label: String
    // Icon: Object
    constructor({ AMap, LngLat, label, Icon}) {
        this.AMap = AMap;
        this.LngLat = LngLat;
        this.label = label;
        this.Icon = Icon;
    };

    // 初始化
    Init() {

        this.MarkerObj = new this.AMap.Marker({
            position: this.LngLat,
            icon: this.Icon,
            title: this.label,
            label: {
                offset: new AMap.Pixel(0, -20),
                content: this.label
            }
        });
        // this.MarkerObj.setLabel({
        //     content:null,
        // });
        // this.MarkerObj.setAnimation('AMAP_ANIMATION_BOUNCE');
        this.ClickEvent();
        this.MouseoutEvent();
        return this.MarkerObj;

    };

    // 添加点击事件
    ClickEvent() {
        this.MarkerObj.on('click', () => {
            this.MarkerObj.setLabel({
                offset: new AMap.Pixel(0, -20),  //设置文本标注偏移量
                content: "乌鲁木齐", //设置文本标注内容
                direction: 'right' //设置文本标注方位
            });
        });
    };
    // 鼠标移出事件
    MouseoutEvent() {
        this.MarkerObj.on('mouseout', () => {
            this.MarkerObj.setLabel({
                content: null,//设置文本标注内容
            });
        })
    };



}

export default Marker;