// 这里利用node里面的readline来进行日志分析

const fs = require('fs')
const path = require('path')

const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')

// 创建 read stream
const readStream = fs.createReadStream(fileName)

// 创建 readline 对象,里面传一个对象，input里面就输入我要读的流
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0

// 利用创建的readline对象逐行读取
// on data是每一块数据来了触发，on line是每一行来了触发
rl.on('line', (lineData) => {
    // 排除异常情况，空行不算
    if (!lineData) {
        return
    }
    // 记录总行出
    sum ++
    // 找到记录浏览器的字段，当时怎么记的就怎么拆
    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0){
        // 如果找到了chrome，就累加chrome的数量
        chromeNum ++
    }
})

// 监听读取完成
rl.on('close', () => {
    console.log('chrome 占比' + chromeNum / sum, chromeNum, sum)
})