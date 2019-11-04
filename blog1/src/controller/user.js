const { exec } = require('../db/mysql')

const login = (username, password) => {
    const sql = `
        select username, realname from users where username='${username}' and password='${password}'
    `
    return exec(sql).then(rows => {
        // 只要第一项，因为一般只有一项
        return rows[0] || {}
    })
}
module.exports = {
    login
}