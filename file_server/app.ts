import fs, { PathLike, readdirSync, statSync } from 'fs';
import path, { resolve } from 'path';
import express from 'express';
import cors from 'cors';


const app = express();
const PORT = 3100; //你可以选择任何你喜欢的端口号
/** 磁盘路径 */
const myDirPath = <Array<string>>['C:/Users/wjt/Downloads', 'D:/h', 'E:/syasin']
app.use(cors())
for (const dir of myDirPath) {
  app.use(express.static(path.join(dir)));  
}
// 启动服务器并监听指定端口  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/** 由路径组成的字符串数组 */
let myFileList = <Array<string>>[]
//———————————————————————————————————————————————————以下是接口———————————————————————————————————————————————————
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/every_file', (req, res) => {
  console.log(req.query.re)
  // 遍历D盘下的所有文件，并生成JSON结构的返回值  
  if (myFileList.length > 0 && req.query.re != '1') {
    res.send(JSON.stringify(myFileList))
    return
  }
  myFileList = <Array<string>>[]
  /** 盘符+路径前缀 字符串 */
  let text_regex = myDirPath.join('|')
  text_regex = text_regex.replace(/\//g, '\\\\')
  // console.log(regex)
  /** 通过字符串创建的正则对象，用于去除盘符+路径前缀 */
  const fullPath_regex = new RegExp(text_regex, 'gi')
  const traverseDir = (dirPath : PathLike, myFileList : Array<string>) => {
    let a = false
    try {
      fs.accessSync(dirPath, fs.constants.F_OK)
    } catch (error) {
      a = true
    }
    if (a) {
      return
    }
    readdirSync(dirPath).forEach(file => {
      const fullPath = resolve(String(dirPath), file)
      if (statSync(fullPath).isDirectory()) {
        traverseDir(fullPath, myFileList); // 递归遍历子目录  
      } else {
        myFileList.push(fullPath.replace(fullPath_regex, "")) // 将文件路径添加到结果数组中  
      }
    })
  }
  for (const dir of myDirPath) {
    traverseDir(dir, myFileList)
  }
  // console.log(myFileList);
  // 将结果数组转换为JSON字符串并发送响应  
  res.send(JSON.stringify(myFileList))
})