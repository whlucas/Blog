const router = require('koa-router')()

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
// 把定义的model引过来
const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = require('../middleware/loginCheck')

// 路由前缀，之后访问的所有的路由前面都有这个前缀
router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    // 拿到参数调controller里面的方法返回数据
    // const listData = getList(author, keyword)
    // // 返回我建立好的模型
    // return new SuccessModel(listData)

    // 有这个参数的就只能查询自己的博客
    if (ctx.query.isadmin) {
        console.log('is admin')
        if (ctx.session.username == null) {
            console.log('is admin, but no login')
            // 未登录
            ctx.body = new ErrorModel('未登录')
            return
        }
        // 给他设置一个author
        author = ctx.session.username
    }

    // 用数据库给我们吐出来的结果，他返回的是一个promise
    // const result = getList(author, keyword)
    // return result.then(listData => {
    //     return new SuccessModel(listData)
    // })

    // 这里要写成async的形式
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function (ctx, next) {
    // const result = getDetail(ctx.query.id)
    // return result.then(data => {
    //     return new SuccessModel(data)
    // })

    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
    // // 先判断有没有登录
    // const loginCheckResult = loginCheck(req)
    // // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
    // if (loginCheckResult) {
    //     return loginCheckResult
    // }

    // const data = newBlog(req.body)
    // return new SuccessModel(data)

    // 这里需要拿到作者，但是作者是传不过来的
    // const author = 'zhangsan'

    // 作者的以及存到session中去了，因为已经判断登录了，所以就一定有
    const body = ctx.request.body
    body.author = ctx.session.username

    // const result = newBlog(body)
    // return result.then(data => {
    //     return new SuccessModel(data)
    // })

    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    // // 先判断有没有登录
    // const loginCheckResult = loginCheck(req)
    // // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
    // if (loginCheckResult) {
    //     return loginCheckResult
    // }

    // const result = updateBlog(ctx.query.id, ctx.request.body)
    // return result.then(val => {
    //     if (val) {
    //         return new SuccessModel()
    //     } else {
    //         return new ErrorModel('更新博客失败')
    //     }
    // })

    const val = await updateBlog(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
    // // 先判断有没有登录
    // const loginCheckResult = loginCheck(req)
    // // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
    // if (loginCheckResult) {
    //     return loginCheckResult
    // }

    // 这里也需要传author,因为要保证只能删除自己的，因为传过来的只有id，在这里要加一个作者的判断
    // const author = 'zhangsan'

    // 作者的以及存到session中去了，因为已经判断登录了，所以就一定有
    const author = ctx.session.username

    // const result = delBlog(ctx.query.id, author)
    // return result.then(val => {
    //     if (val) {
    //         return new SuccessModel()
    //     } else {
    //         return new ErrorModel('删除博客失败')
    //     }
    // })

    const val = await delBlog(ctx.query.id, author)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
})

module.exports = router