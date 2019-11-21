const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger') // 开发环境下控制台打印的东西比较的好看

// 引入mysql xss npm install mysql xss --save

// 这里引入session和redis
// npm install koa-generic-session koa-redis redis --save
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const index = require('./routes/index')
const users = require('./routes/users')

// 新写了一个路由这里把他引过来
const blog = require('./routes/blog')
const user = require('./routes/user')


// 把配置引过来
const { REDIS_CONF } = require('./conf/db')

// 引入morgan来写日志
// npm i koa-mogan --save
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// 前端的东西
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // 获取当前时间
  const start = new Date()
  // 做其他的事情,这里next()都是async函数，执行完返回promise，可以被await执行
  await next()
  // 打印做这个事情的耗时
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 用morgan写日志
const ENV = process.env.NODE_ENV
if(ENV !== 'production') {
  app.use(morgan('dev')) // dev表示一种日志格式
}else{
  // 线上环境
  const logFileName = path.join(__dirname,'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flag: 'a'
  })
  app.use(morgan('combined', {  // combined表示一种日志格式
    stream: writeStream
  }));
}

// 要在注册路由之前写session的东西
app.keys = ['WJiol#23432_'] // 这是一个秘钥
app.use(session())
// 将插件注册为中间件
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    // all: '127.0.0.1:6379' // 先写死本地的 redis server,后期写到配置文件里面去
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`   // 从配置中获取
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// 新写的路由引用完事之后要来这里注册
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
}); 

module.exports = app
