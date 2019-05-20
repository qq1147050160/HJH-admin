const {query} = require('../db/db.js')
const md5 = require('blueimp-md5')
//密码加密提取
module.exports.encrypt = (pswd) => {
    let pd = md5(pswd)
    let jiamipd = ''
    for (let i = 0; i < pd.length; i++) {
        jiamipd += pd[i] ^ 6
    }
    pd = jiamipd
    // 给加密后的密码返回
    return pd
}

// 查询账号密码
module.exports.userLogin = (userData, callback) => {
    const regEx = /^([0-9A-Za-z.@]+)$/
    if (regEx.test(userData.username) && regEx.test(userData.password) ) {
        const sql = 'SELECT `username`,`password`,`enabled` FROM hjh_user WHERE `username` ="' + userData.username + '" AND `password` = "'+userData.password+'"';
        query(sql, (err, res) => {
            if (err) {
                return callback(err)
            }
            callback(null, res)
            //记录最后登入时间
            query('UPDATE `hjh_user` SET lastlogin = NOW() WHERE  `username` = "'+ userData.username +'"', (err, res) => {})
        })
        
    } else {
        callback('illegalString')
    }
}

//获取服务器列表
module.exports.serverList = (callback) => {
    const sql = 'SELECT `servername`,`serverid` FROM server'
    query(sql, (err, res) => {
        if (err) {
            return callback(err)
        }
        callback(null, res)
    })
}

//获取角色列表
module.exports.roleList = (userData, callback) => {
    const regEx = /^([0-9A-Za-z.@]+)$/
    if (regEx.test(userData.username) && regEx.test(userData.serverid) ) {
        const sql = 'SELECT * FROM server_user WHERE `username` ="' + userData.username + '" AND `serverid` = '+userData.serverid+'';
        query(sql, (err, res) => {
            if (err) {
                return callback(err)
            }
            callback(null, res)
        })
    } else {
        callback('error')
    }
}

// 获取所有角色数量
module.exports.getAllRoleNumb = (callback) => {
    const sql = 'SELECT `id` FROM server_user'
    query(sql, (err, res) => {
        if (err) {
            return callback(err)
        }
        callback(null, res)
    })
}

// 创建角色
module.exports.createRole = (data, callback) => {
    data.createtime = null;//创建时间默认
    const sql = 'INSERT INTO `server_user` SET ?'
    query(sql, data, (err, res) => {
        if (err) {
            return callback(err)
        }
        callback(null, res)
    })
}