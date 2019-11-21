const http = require('http')

// 定义一个用来组合中间键的函数

function compose(middlewareList){
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(
                    // 这里fn其实传进来的是一个中间键函数他执行完返回的本来就是promise的，这里再给他包一层promise就是为了防止他传进来的不是async函数
                    fn(ctx, dispatch.bind(null, i + 1)) // 这里对应koa里面中间键函数里面传入的ctx和next() 这里实现的是next的逻辑
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return dispatch(0)
        // 解决了如何执行next()的问题,以及执行完返回promise的问题
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn) // 执行use方法就可以把中间键注册到这个里面来
        return this // 可以链试调用
    }

    // 这个函数为了把req和res来变成一个ctx
    createContext(req, res){
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        return ctx
    }

    callback() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createContext(req, res)
            // 这里有了返回的fn，有了ctx就可以放进去去执行了
            return this.handleRequest(ctx, fn)
        }
    }

    handleRequest(ctx, fn){
        return fn(ctx)
    }

    // 监听端口
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = LikeKoa2