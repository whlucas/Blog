const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', err => {
    console.error(err)
})

// 提供set和get函数
function set (key, val) {
    // 如果传过来的是对象，这里把他改为字符串的格式
    if (typeof val === 'object'){
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get (key) {
    const promise = new Primise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            // 这里的输出有好几种情况
            // 第一种是瞎传了一个key,返回的是null
            if (val == null){
                resolve(null)
                return
            }

            // 这里这个try catch是为了兼容JSON转换格式
            try {
                // 如果成功拿到了，拿到的是一个json格式的，就把他转化为对象
                resolve(
                    JSON.parse(val)
                )
            } catch (ex) {
                resolve(val)
            }

            // 这里就不退出了，退出就还的再连接了
            // redisClient.quit()
        })
    })
}

module.exports = {
    set,
    get
}