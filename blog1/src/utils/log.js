// 写日志的方法

const fs = require('fs')
const path = require('path')

// 一个传入文件名生成stream的函数，这里生成的是右边的那个水桶，就是输出的地方
function createWriteStream(fileName){
    // 这里传入的是日志的文件名，所以这里要先找到存日志文件的地方
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a' // a代表累加写，如果不传，则重启后再读到这里的时候他就把前面的全部删了重新写了
    })
    return writeStream
}

// 写访问日志

// 这个是往里写的地方
const accessWriteStream = createWriteStream('access.log')

// 写日志的函数，往writeStream里面写log
function writelog(writeStream, log){
    writeStream.write(log + '\n') // 通过创建出来的那个水桶里面的.write方法来往水桶里面写log
}

// 这个函数提供给外部使用，log是传进来需要写的东西
function access(log) {
    // 这个里面调一个写日志的方法
    writelog(accessWriteStream, log)
}
 
// 这个里面暴露的access方法在app.js里面去用

module.exports = {
    access
}