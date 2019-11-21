const fs = require('fs')
// 不同系统里面的路径拼接方式不一样，用到这个path包
const path = require('path')

// __dirname就是当前目录
// 表示我们要处理一个当前目录加data.txt的目录
const fileName = path.resolve(__dirname, 'data.txt')

// 下面的操作都是异步的

// 读取文件内容
// fs.readFile(fileName, (err, data) => {
//     if (err){
//         console.log(err)
//         return
//     }
//     // data是二进制类型，需要转化为字符串
//     console.log(data.toString())
// })

// 写入文件
const content = '这是新写入的内容\n'
const opt = {
    flag: 'a' // 定义一个标识a代表追加写入，覆盖用'w'
}
fs.writeFile(fileName, content, opt, (err) => {
    if (err) {
        console.log(err)
    }
})


// 判断文件是否存在
fs.exists(fileName, (exist) => {
    console.log('exist', exist)
})