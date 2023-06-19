# 项目启动教程

## 1.所需软件
- Node.js
    - [下载地址](https://nodejs.org/en)
    - [Node安装及环境配置教程](http://www.taodudu.cc/news/show-3611752.html)

## 2.开发工具 
- visual studio code

## 3.安装依赖
- 打开终端，进入到当前项目的根目录下（vite-project），输入以下命令
    - npm i
    - 安装成功后，输入以下命令启动项目
    - npm run dev

- 启动成功后在浏览器中输入终端中输出的地址即可打卡项目


## 注意点
- 上传地图的 .csv 数据时，需要为地图数据设置标题行，如：
    * ID,   Longitude,  Latitude,       RudderAngle,    Sign1,  SpraySign
    * 1,    39.940521,  116.2799521,    45.33,          1,      1
* 需要设置 ID, Longitude ... 等字段 *

## 项目夸平台问题
- 当把vue项目通过一个平台打包发送到另一个平台运行时，可能会出现esbuild错误，解决方法：
    - rm -rf node_modules package-lock.json (把node_modules, package.lock.json删除)
    - npm install （重新安装）

## 问题
- 通过获取当前车辆撞状态的值，在此基础上进行控制值的变化，可能会存在跳值的情况
- 点击一次获取车辆的当前状态，将点击的值在当前状态的基础上+1/-1，点击多次同样只能+1/-1，问题暂未解决
