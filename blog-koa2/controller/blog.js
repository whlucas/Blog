const { exec } = require('../db/mysql')
const xss = require('xss')

// 修改：要在每个函数的前面加async的修饰，最后我们返回await exec（）执行

const getList = async (author, keyword) => {
    // 为什么写1=1这个永远正确的语句，因为如果author和keyword都没有值，这个where后面就没接东西了，就报错 
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return await exec(sql)
}

const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}'`
    // return await exec(sql).then(rows => {
    //     return rows[0]
    // })

    // 用await的形式写
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData 是一个博客对象， 包含title content author 属性

    // 这里预防xss攻击
    // npm install xss --save
    // 用这个函数把闯过来的东西包起来就可以了

    const title = xss(blogData.title)
    // console.log(title);
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()
    const sql = `
        insert into blogs(title, content, createtime, author) values('${title}', '${content}', '${createTime}', '${author}')
    `

    // return await exec(sql).then(insertData => {
    //     return {
    //         id: insertData.insertId // 表示新建博客，插入到数据表里面的id
    //     }
    // })

    // 用await的形式写
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
    
}

const updateBlog = async (id, blogData = {}) => {
    // id是更新博客的id
    // blogData 是一个博客对象， 包含title content 属性

    // 更新的时候作者的名字不用更新

    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`
    // return exec(sql).then(updateData => {
    //     if (updateData.affectedRows > 0) {
    //         return true // 如果修改的大于等于一行返回true
    //     }
    //     return false
    // })

    // 用await的形式写
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true // 如果修改的大于等于一行返回true
    }
    return false
}

const delBlog = async (id, author) => {
    // id是删除博客的id
    const sql = `delete from blogs where id=${id} and author='${author}'`
    // return await exec(sql).then(delData => {
    //     if (delData.affectedRows > 0) {
    //         return true // 如果修改的大于等于一行返回true
    //     }
    //     return false
    // })

    // 用await的形式写
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true // 如果修改的大于等于一行返回true
    }
    return false

    
}

module.exports = {
    getList,
    getDetail, 
    newBlog,
    updateBlog,
    delBlog
}