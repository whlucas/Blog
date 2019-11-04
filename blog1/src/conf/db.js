const env = process.env.NODE_ENV // 环境参数

// 依据线上线下的环境进行不同的配置

let MYSQL_CONF

if(env === 'dev') {
    MYSQL_CONF = {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "Lll-13999520192",
        database: 'myblog'
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
}

module.exports = {
    MYSQL_CONF
}