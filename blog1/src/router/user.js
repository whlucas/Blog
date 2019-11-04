const { login } = require('../controller/user')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')



const hangleUserRouter = (req, res) => {
    const method = req.method // GET POST

    // 登录
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            // 如果能查出来数据
            if(data.username) {
                // 登录之后依据app.js中设置的req里面的session赋值，去存储session
                req.session.username = data.username
                req.session.realname = data.realname

                console.log('req.session',req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }

    if (method === 'GET' && req.path === '/api/user/login-test'){
        // 登录验证的时候去判断session
        if (req.session.username){
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}

module.exports = hangleUserRouter