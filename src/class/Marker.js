
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
        this.IconSize = Icon.getSize();
    };

    // 初始化
    Init() {

        this.MarkerObj = new this.AMap.Marker({
            position: this.LngLat,
            icon: this.Icon,
            title: this.label,
            // 设置偏移量，使标记点标记在定位的中心点
            offset:[-this.IconSize[0]/2, -this.IconSize[1]/2],
            label: {
                offset: new AMap.Pixel(0, -20),
                content: this.label
            },
            // 设置是否可以拖拽
            draggable: true,
            cursor: 'move',
            animation:'AMAP_ANIMATION_BOUNCE'
        });
        this.MarkerObj.moveTo(this.LngLat, {
            duration: 1000,
            delay: 500,
        });
        // this.MarkerObj.setLabel({
        //     content:null,
        // });
        // this.MarkerObj.setAnimation('AMAP_ANIMATION_BOUNCE');
        this.ClickEvent();
        this.MouseoutEvent();
        this.MouseoverEvent();
        this.DragendEvent();
        return this.MarkerObj;

    };

    // 添加点击事件
    ClickEvent() {
        this.MarkerObj.on('click', () => {
            const position = this.MarkerObj.getPosition();
            console.log(position);
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
    // 鼠标移入事件
    MouseoverEvent() {
        this.MarkerObj.on('mouseover', () => {
            this.MarkerObj.setLabel({
                offset: new AMap.Pixel(0, -20),  //设置文本标注偏移量
                content: this.label, //设置文本标注内容
                direction: 'right' //设置文本标注方位
            });
        })
    };
    // 标记点移动结束事件
    DragendEvent(){
        this.MarkerObj.on('dragend', ()=>{
            const position = this.MarkerObj.getPosition();
            console.log(position);
        });
    };



}

export default Marker;