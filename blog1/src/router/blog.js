// 这个里面的函数将来会被app里面的函数调用，调用的时候会往里面传req，res，所以这个里面可以拿到
const {
    getList,
    getDetail,
    newBlog, 
    updateBlog,
    delBlog
} = require('../controller/blog')
// 把定义的model引过来
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 这里来一个统一的登录验证的方法

const loginCheck = (req) => {
    // 如果我传进来的req没有设置ression.username,说明没登录
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
    // 如果有的话，就啥也不干就行，返回undefined
}


const hangleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list'){
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // 拿到参数调controller里面的方法返回数据
        // const listData = getList(author, keyword)
        // // 返回我建立好的模型
        // return new SuccessModel(listData)

        // 有这个参数的就只能查询自己的博客
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult){
                // 未登录
                return loginCheckResult
            }
            // 给他设置一个author
            author = req.session.username
            console.log('author',author)
        }

        // 用数据库给我们吐出来的结果，他返回的是一个promise
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const data = getDetail(id)
        // return new SuccessModel(data)

        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // 先判断有没有登录
        const loginCheckResult = loginCheck(req)
        // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
        if (loginCheckResult) {
            return loginCheckResult
        }

        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        
        // 这里需要拿到作者，但是作者是传不过来的
        // const author = 'zhangsan'

        // 作者的以及存到session中去了，因为已经判断登录了，所以就一定有
        req.body.author = req.session.username

        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        // 先判断有没有登录
        const loginCheckResult = loginCheck(req)
        // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        // 先判断有没有登录
        const loginCheckResult = loginCheck(req)
        // 如果他有返回值的话，返回他返回的那个rejectl,后面就不会再执行了
        if (loginCheckResult) {
            return loginCheckResult
        }

        // 这里也需要传author,因为要保证只能删除自己的，因为传过来的只有id，在这里要加一个作者的判断
        // const author = 'zhangsan'

        // 作者的以及存到session中去了，因为已经判断登录了，所以就一定有
        const author = req.session.username

        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }
}

module.exports = hangleBlogRouter