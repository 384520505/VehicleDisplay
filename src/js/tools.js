import { ElMessage } from 'element-plus'
import Papa from 'papaparse'


const FileToText = (file)=>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsText(file);
            reader.onload = e => {
                console.log("文件读取成功！--- tools, readAsText -> onload()");
                ElMessage({
                    message:'读取成功！',
                    type:'success'
                });
                resolve(e.target.result);
            };
            reader.onerror = e =>{
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
    let fileURL = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    elemento.href = fileURL;
    elemento.download = name;
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
}


export {
    FileToText,
    DownloadFile
}