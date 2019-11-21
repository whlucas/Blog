const http = require('http')

const server = http.createServer((req, res) => {

    // 模拟日志
    // 这里所有console的内容都会被自动的存到日志里面去
    // 通过pm2 log app就可以查看一下，文件保存到了默认配置的地方
    console.log('cur time', Date.now())
    // 模拟错误
    console.error('假装出错', Date.now())
    
    // 模拟一个错误
    if (req.url === '/err'){
        throw new Error('/err 出错了') // 访问/err请求的时候就走到这里了，这个程序就没法运行了
    }
    // 发现当我们访问了这个/err之后再去访问这个根路由的时候就还可以运行，他实际上遇到错误了就给你自动重启了

    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            msg: 'pm2 test server 2'
        })
    )
})

server.listen(8001)

// 核心价值
// 进程守护，多进程，日志记录

// 这里我们通过npm run prd的方式来启动
// "prd": "cross-env NODE_ENV=production pm2 start app.js" 如果是koa2一般是 pm2 start bin/www.js
// 这样启动了之后控制台可以继续使用，说明后台运行，而之前的nodemon是前台运行

// pm2命令
// pm2 start 后面可以跟一个要启动的文件路径，还可以跟一个配置文件的路径
// pm2 list 看一下启动了什么
// pm2 restart 重启 改了以后就 pm2 restart app 或者 pm2 restart 0 就可以了
// pm2 stop 停止
// pm2 delete  删除
// pm2 info 看信息 看一下入口代码的位置等等
// pm2 log 看日志
// pm2 monit 看这个进程的cpu和内存 上面这几个都是跟的AppName或者id


// 进程守护（遇到错误自动给你重启）


// 为什么要多进程
// 操作系统限制一个进程的内存，没有办法有效的利用机器的全部内存
// 无法利用多核cpu的优势

// 多个进程就有多个日志记录