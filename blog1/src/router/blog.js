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


const hangleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = req.query.id

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list'){
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // 拿到参数掉controller里面的方法返回数据
        // const listData = getList(author, keyword)
        // // 返回我建立好的模型
        // return new SuccessModel(listData)

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
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        
        // 这里需要拿到作者，但是作者是传不过来的
        const author = 'zhangsan'
        req.body.author = author

        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
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
        // 这里也需要传author,因为要保证只能删除自己的，因为传过来的只有id，在这里要加一个作者的判断
        const author = 'zhangsan'
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