const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 路由前缀，之后访问的所有的路由前面都有这个前缀
router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    // 获取请求里面的信息，因为在app.json里面已经注册了一些中间件了，所以我们就不用这里去手动分析了
    const { username, password } = ctx.request.body
    // const result = login(username, password)
    // return result.then(data => {
    //     // 如果能查出来数据
    //     if (data.username) {
    //         // 登录之后依据app.js中设置的req里面的session赋值，去存储session
    //         req.session.username = data.username
    //         req.session.realname = data.realname

    //         console.log('req.session', req.session)
    //         return new SuccessModel()
    //     }
    //     return new ErrorModel('登录失败')
    // })

    const data = await login(username, password)
    if (data.username) {
        // 登录之后依据app.js中设置的req里面的session赋值，去存储session
        ctx.session.username = data.username
        ctx.session.realname = data.realname

        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

// // 加一个登录验证的路由
// router.get('/session-test', async function (ctx, next) {
//     // 这里判断一下session能不能用，这里之前注册过之后ctx里面就会有一个这个session，viewCount就代表它的访问次数
//     if (ctx.session.viewCount == null){
//         ctx.session.viewCount = 0
//     }
//     ctx.session.viewCount++
//     ctx.body = {
//         errno: 0,
//         viewCount: ctx.session.viewCount
//     }
// })
module.exports = router