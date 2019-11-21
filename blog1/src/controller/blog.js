const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = (author, keyword) => {
    // 为什么写1=1这个永远正确的语句，因为如果author和keyword都没有值，这个where后面就没接东西了，就报错 
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword){
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
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

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId // 表示新建博客，插入到数据表里面的id
        }
    })

    
}

const updateBlog = (id, blogData = {}) => {
    // id是更新博客的id
    // blogData 是一个博客对象， 包含title content 属性

    // 更新的时候作者的名字不用更新

    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true // 如果修改的大于等于一行返回true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id是删除博客的id
    const sql = `delete from blogs where id=${id} and author='${author}'`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true // 如果修改的大于等于一行返回true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail, 
    newBlog,
    updateBlog,
    delBlog
}