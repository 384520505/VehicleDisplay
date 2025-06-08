<template>
    <div class="contaier">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>CSV文件</span>
                    <!-- <el-button class="button" text>Operation button</el-button> -->
                </div>
            </template>
            <el-row>
                <el-upload ref="upload" class="upload-demo" action="" accept=".csv" :limit="1" :on-exceed="handleExceed"
                    :on-change="selectFile" :auto-upload="false" method="put">
                    <template #trigger>
                        <el-button type="primary">选择文件</el-button>
                    </template>
                    <template #tip>
                        <div class="el-upload__tip text-red">
                            文件支持类型：.csv
                        </div>
                    </template>
                </el-upload>
            </el-row>
            <el-row class="setMapid">
                <span class="ml-3 w-35 text-gray-600 inline-flex items-center">设置地图ID:</span>
            </el-row>
            <el-row class="mapidInput">
                <el-col class="inputLeft" :span="14">
                    <el-input class="el-input" v-model="mapId" label placeholder="请输入地图ID编号" />
                </el-col>
                <el-col class="buttonRight" :span="10">
                    <el-button class="ml-3" type="success" @click="submitUpload">
                        上传
                    </el-button>
                </el-col>
            </el-row>

            <!-- Preview Table -->
            <div class="preview-table-container" v-if="previewRows.length > 0">
                <el-table :data="previewRows" style="width: 100%;" border stripe>
                    <el-table-column v-for="header in previewHeaders" :key="header" :prop="header" :label="header">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>

import { genFileId, ElMessage, ElLoading } from 'element-plus'
import Papa from 'papaparse'
import { FileToText, DownloadFile } from '../js/tools.js'
import { putMap } from '../js/Ajax.js'

export default {
    data() {
        return {
            mapId:'',
            mapString:'',
            mapData:'',
            previewHeaders: [],
            previewRows: [],
        }
    },

    mounted() {

    },

    methods: {
        // 选择文件
        async selectFile(file) {
            const mapString = await FileToText(file.raw);
            this.mapString = mapString;
            const MAX_PREVIEW_ROWS = 10;

            let fullParsedDataForMapData; // To store the complete parsed data for this.mapData

            // Parse CSV for preview
            const parsedDataWithHeader = Papa.parse(mapString, { header: true, skipEmptyLines: true });
            if (parsedDataWithHeader.data && parsedDataWithHeader.data.length > 0 && parsedDataWithHeader.meta.fields && parsedDataWithHeader.meta.fields.length > 0) {
                this.previewHeaders = parsedDataWithHeader.meta.fields;
                this.previewRows = parsedDataWithHeader.data.slice(0, MAX_PREVIEW_ROWS);
                fullParsedDataForMapData = { data: parsedDataWithHeader.data, meta: { fields: parsedDataWithHeader.meta.fields } };
            } else {
                const parsedDataNoHeader = Papa.parse(mapString, { skipEmptyLines: true });
                if (parsedDataNoHeader.data && parsedDataNoHeader.data.length > 0) {
                    if (parsedDataNoHeader.data.length === 1 && parsedDataNoHeader.data[0].length === 1 && parsedDataNoHeader.data[0][0] === "") {
                        this.previewHeaders = [];
                        this.previewRows = [];
                        fullParsedDataForMapData = { data: [], meta: { fields: [] } };
                    } else {
                        this.previewHeaders = parsedDataNoHeader.data[0].map((_, index) => `Column ${index + 1}`);
                        const dataRows = parsedDataNoHeader.data.slice(1);
                        // If the file had only one row of data and no actual headers.
                        if (parsedDataNoHeader.data.length === 1) {
                            this.previewRows = parsedDataNoHeader.data.slice(0, MAX_PREVIEW_ROWS);
                            fullParsedDataForMapData = { data: parsedDataNoHeader.data, meta: { fields: this.previewHeaders } };
                        } else {
                            this.previewRows = dataRows.slice(0, MAX_PREVIEW_ROWS);
                            fullParsedDataForMapData = { data: dataRows, meta: { fields: this.previewHeaders } };
                        }
                         // Ensure fullParsedDataForMapData.data uses original first row if it was actual data
                        if (parsedDataNoHeader.data.length === 1) {
                             // fullParsedDataForMapData is already set correctly above for this case
                        } else if (parsedDataWithHeader.meta.fields === undefined || parsedDataWithHeader.meta.fields.length === 0) {
                            // If PapaParse didn't find headers, the first row is data, not to be sliced off for fullParsedDataForMapData
                            fullParsedDataForMapData = {data: parsedDataNoHeader.data, meta: {fields: this.previewHeaders}};
                        }

                    }
                } else {
                    this.previewHeaders = [];
                    this.previewRows = [];
                    fullParsedDataForMapData = { data: [], meta: { fields: [] } };
                }
            }

            let MapID = this.isNewStructCSVData(mapString);
            if(MapID){
                this.mapId = MapID;
                this.readCSVData(mapString); // This reads the full mapString again, populating this.mapData correctly.
                                            // So, fullParsedDataForMapData is not used in this specific branch.
            } else if (fullParsedDataForMapData && fullParsedDataForMapData.data.length > 0) {
                 this.mapData = { data: fullParsedDataForMapData.data, meta: { fields: fullParsedDataForMapData.meta.fields } };
            } else {
                this.mapData = { data: [], meta: { fields: [] } }; // Ensure mapData is initialized
            }
        },
        // 超出文件数量
        handleExceed(files) {
            this.$refs.upload.clearFiles()
            const file = files[0]
            console.log(file)

            file.uid = genFileId()
            this.$refs.upload.handleStart(file)
        },

        // 判断读取的csv数据是原始数据还是新格式的数据（带有MapID），若是原始数据返回空，反之返回新数据的MapID
        isNewStructCSVData(mapString){
            let mapData = Papa.parse(mapString,{
                header:false,
            });
            if(mapData.data[0][0] === 'MapID') return mapData.data[1][0];
            return ;
        },

        // 读取带有MapID的csv数
        readCSVData(mapString){
            let mapData = Papa.parse(mapString,{
                header:true
            });
            this.mapData = mapData;
        },

        // 文件转换（将原始的不带标题行和mapid的csv数据，转换为带标题行和mapid的csv数据）
        transformCSVData(mapString){
            let mapData = Papa.parse(mapString,{
                header:false,
            });
            const header = ['MapID', 'ID', 'Longitude', 'Latitude', 'RudderAngle', 'Sign1', 'SpraySign']
            mapData.meta.fields = header;

            mapData.data = mapData.data.map((item, oIndex) => {
                let obj = {};
                if(oIndex === 0) obj.MapID = this.mapId;
                else obj.MapID = '';
                header.slice(1).forEach((headerName, index) => {
                    obj[headerName] = item[index]

                }) 
                return obj
            });
            this.mapData = mapData;
        },

        // 上传地图数据
        async submitUpload() {
            if(!this.mapId){
                ElMessage({
                    message:'地图名称不能为空！',
                    type:'warning'
                })
                return ;
            }
            
            // if MapID not existed, transform csv data to new struct csv data of contain MapID
            let MapID = this.isNewStructCSVData(this.mapString);
            if(!MapID){
                this.transformCSVData(this.mapString);
            }
            /**
             * coordinates数组解析：
             * 最外层大括号表述坐标的数据
             * 内部的第一个数组存放的是地图中路径的经纬度数据
             * 内部的第二个数组存放的是航向角和喷洒标志位
             * ep:
             *  coordinates = [
             *      [
             *          [ 122.12, 34.45 ],
             *          [ 123.12, 35.45 ],
             *                 ...
             *      ],
             *      [
             *          [ 45.00, 0 ],  其中45表示航向角， 0 表示该坐标的位置为非喷洒点
             *          [ 45.00, 1 ]   其中45表示航向角， 1 表示该坐标的位置为喷洒点
             *      ]
             *  ]
             */
            
            let coordinates = [ [], [] ];
            // 存储坐标的经纬度
            this.mapData.data.forEach(item => {
                let coordinate = [item.Latitude*1, item.Longitude*1];
                coordinates[0].push(coordinate);
            });
            // 存储航向角和喷洒标志位
            this.mapData.data.forEach(item => {
                let assiastMsg = [item.RudderAngle*1, item.SpraySign*1];
                coordinates[1].push(assiastMsg);
            });
            const map = {
                type:'MultiLineString',
                id:this.mapId,
                coordinates
            };
            console.log('put map data', map);
            putMap(map)
            .then(res=>{
                if(res.status === 200){
                    ElMessage({
                        message: res.data,
                        type:'success'
                    })
                    if(res.data === 'SUCCESS') DownloadFile(`${this.mapId}.csv`, this.mapData);
                }
            })
            .catch(err=>{
                ElMessage.error('地图上传出错！');
                console.log(err)
            });

        }
    }
}


</script>

<style scoped lang="less">
.contaier {
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

        .upload-demo {
            text-align: left;
            width: 100%;
        }

        .setMapid {
            margin-top: 1rem;
        }

        .mapidInput {
            margin-top: 15px;

            .inputLeft{
                text-align: left;
                .el-input {
                    width: 100%;
                }
            }

            .buttonRight{
                text-align: right;
            }

            
        }
    }

    .preview-table-container {
        margin-top: 1rem;
        max-height: 300px; /* Adjust as needed */
        overflow: auto;
        width: 100%;
        border: 1px solid #ebeef5; // Optional: to match el-table border
    }

    .preview-table-container .el-table th {
        font-weight: bold;
        // background-color: #f5f7fa; // Optional: header background
    }

    // Ensure the table itself within the container also respects the container's width
    .preview-table-container .el-table {
        width: 100%;
    }
}
</style>
