// 这里写一个验证有没有登录的中间键
// 中间键必须符合koa2的规则，必须是async函数
const { ErrorModel } = require('../model/resModel')

// 中间键必须符合koa2的规则，必须是async函数
// 注意ctx
// next()前面要是await，因为下一个中间键还是async
module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        await next()
        return
    }
    // res.json(
    //     new ErrorModel('未登录')
    // )

    // 返回要用ctx.body
    ctx.body = new ErrorModel('未登录')
}