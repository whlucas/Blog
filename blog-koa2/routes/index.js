const router = require('koa-router')() // 这个插件的是独立于koa2的

// ctx就是request和response的集合
// 这里的回调的是async函数,不写也会兼容，但可能会出错
router.get('/list', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

// 最简单的返回形式
router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

// 返回一个json
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
