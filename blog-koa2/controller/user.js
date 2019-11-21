const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

// 加async的修饰，然后用await的方式去执行promise

const login = async (username, password) => {
    // 这里利用utils里面写好的cryp函数里面的函数来进行密码的加密
    // 生成加密密码
    password = genPassword(password)

    // 防止sql注入
    // 利用mysql给我提供的防止sql注入的函数来过一遍传过来的东西就可以防止sql注入了
    username = escape(username)
    password = escape(password)
    // const sql = `
    //     select username, realname from users where username='${username}' and password='${password}'
    // `

    // 在通过escape函数过了一遍之后，就可以把插入的地方的单引号去掉了
    console.log(password)

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `

    // return exec(sql).then(rows => {
    //     // 只要第一项，因为一般只有一项
    //     return rows[0] || {}
    // })

    // 用await的形式写
    const rows = await exec(sql)
    return rows[0] || {}
}
module.exports = {
    login
}