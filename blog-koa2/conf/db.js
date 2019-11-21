const env = process.env.NODE_ENV // 环境参数

// 依据线上线下的环境进行不同的配置

let MYSQL_CONF

// 启动redis
// 1、 cd 到 redis 的安装目录 我装在c盘根目录
// 2、 执行 redis 启动命令
// C:\Redis-x64-3.0.504>redis-server.exe  redis.windows.conf

// 首先电脑上装上redis，这里npm install redis --save
// 这里来一个redis的基本配置
let REDIS_CONF

if(env === 'dev') {
    MYSQL_CONF = {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "Lll-13999520192",
        database: 'myblog'
    }

    // redis
    REDIS_CONF ={
        port: 6379,
        host: '127.0.0.1',

    }
}

// 线上环境就用线上环境数据库
if(env === 'production') {
    MYSQL_CONF = {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "Lll-13999520192",
        database: 'myblog'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1',

    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}