// 标准输入输出，演示pipe工能的使用
// 运行完之后，输入啥就输出啥，这里标准输入完事之后自己就流入到标准输出里面了

// process.stdin.pipe(process.stdout)

// const http = require('http')
// const server = http.createServer((req, res) => {
//     if(req.method === 'POST'){
//         req.pipe(res) // req里面接收的东西立马就流入到res当中去了
//     }
// })
// server.listen(8000)


// stream实现复制文件
// const fs = require('fs')
// const path = require('path')

// // 定义两个路径，一个是原来的文件，一个拷贝到的文件
// const fileName1 = path.resolve(__dirname, 'data.txt')
// const fileName2 = path.resolve(__dirname, 'data-bak.txt')

// // 这里分别对着两个路径下的文件建立两个流
// const readStream = fs.createReadStream(fileName1)
// const writeStream = fs.createWriteStream(fileName2)

// // 用流的方式进行拷贝
// readStream.pipe(writeStream)

// // 这个可以监听每一点流里面的东西
// readStream.on('data', chunk => {
//     console.log(chunk.tString())
// })

// // 监听一下拷贝完成
// readStream.on('end', () => {
//     console.log('copy done')
// })


// 演示利用stream处理get请求读取一个文件，并且返回这个文件里面的东西

const http = require('http')
const fs = require('fs')
const path = require('path')

// 读出文件名
const fileName1 = path.resolve(__dirname, 'data.txt')

const server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        // 创建一个水桶
        const readStream = fs.createReadStream(fileName1)
        // 这个水桶的管道直接连到res就可以了
        readStream.pipe(res)
    }
})
server.listen(8005)
