// package.json中的main当中的主文件名要和自己新建的主文件名对上
// 然后在vscode里面就可以直接调试了

const querystring = require('querystring')
const handleBLogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// session 数据
const SESSION_DATA = {}

// 一个用于处理post data 的函数
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        // 如果是post请求，发过来的数据类型是正确的情况下
        if (req.method !== 'POST'){
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json'){
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData){
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    // 解析session
    // 一进来就会走这个，给你给一个userId，这个id里面之前已经设置过session了就不设置，如果没有，那么赋值为一个空对象，在cookie中设置这个username值，在登陆的时候设置这个username对应的session
    let needSetCookie = false // 加一个开关控制是否设置userId
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            // 没有的话初始化成一个空对象
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 获取cookie的过期时间
    const getCookieExpires = () => {
        const d = new Date()
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
        return d.toGMTString()
    }
    

    // 处理postData,这里点then里面的postData就是最后拿到的postData
    getPostData(req).then(postData => {
        // 把他挂在body里面，这样后面就都能从body里面拿到post传来的数据
        req.body = postData

        // 处理blog路由
        // 由于router返回的是个promise，所以要用promise的形式去处理
        const blogResult = handleBLogRouter(req, res)
        if (blogResult){
            blogResult.then(blogData => {
                if(needSetCookie){
                    // 如果需要设置cookie的话，就设置一下cookie
                    // 这里需要设置本条cookie不能让客户端去修改，万一他修改成别人的就可以获取到别人的数据了,需要在后面加一个httpOnly
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; expires=${getCookieExpires()} httpOnly`) // 如果不是根路由那么访问其他的路由则cookie失效
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        
        // 原来没有返回promise的时候的处理方式
        // const blogData = handleBLogRouter(req, res)
        // if (blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }

        // 处理user路由
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

        // 现在返回的是result
        const userResult = handleUserRouter(req, res)
        if(userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    // 如果需要设置cookie的话，就设置一下cookie
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; expires=${getCookieExpires()} httpOnly`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        // 未命中路由
        // 这个content-type表示返回纯文本
        res.writeHead(404, {
            "Content-type": "text/plain"
        })
        res.write("404 Not Found\n")
        res.end()

    })
}

module.exports = serverHandle

// process.env.NODE_ENV