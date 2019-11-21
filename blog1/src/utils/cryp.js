const crypto = require('crypto') // 自带的库

// 定义一个密钥

const SECRET_KEY = 'WJiol_8776#'

// 用md5加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    // content就是要加密的东西,后面的digest('hex')表示把输出变成16进制的方式
    return md5.update(content).digest('hex')
}

// 加密函数

function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}