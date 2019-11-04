// 这里封装一个类用来输出我们想要的数据
class BaseModel {
    constructor(data, message){
        // 我们传入的data是字符串类型，第二个message是字符串类型，但如果第一个传进来的是字符串类型，第二个没传的话这里做一个兼容
        if(typeof data === 'string'){
            this.message = data
            data = null
            message = null
        }
        if(data){
            this.data = data
        }
        if (message){
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}