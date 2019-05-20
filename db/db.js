const mysql = require('mysql')
const {dbConfig} = require('../config')

// 创建连接池
const pool = mysql.createPool(dbConfig)

// 自定义查询方法
module.exports.query = (...args) => {
    // 3个参数:sql语句, [查询参数], 回调方法
    const callback = args.pop()
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err)
        }
        connection.query(...args, function (...res) {
            // 释放连接池
            connection.release()
            callback(...res)
        })
    })
}