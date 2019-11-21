const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 统一执行sql的函数

function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

// 这里不用断开连接，因为要多次查询,不能end
// con.end()

module.exports = {
    exec,
    // 利用输出的这个函数来预防sql注入
    escape: mysql.escape
}