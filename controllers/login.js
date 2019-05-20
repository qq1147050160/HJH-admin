const loginModol = require('../models/login.js')

module.exports.login = (userData, ws) => {
    userData.password = loginModol.encrypt(userData.password)// 对密码处理
    
    loginModol.userLogin(userData, (err, loginRes) => {
        if (err) { return ws.send('{"error":"服务器出错了!"}') }
        
        if (String(loginRes) === '') {
            //密码错误
            let obj = {
                "result": "loginErr",
                "data": '账号或密码错误!!'
            }
            return ws.send(JSON.stringify(obj))
        }

        if (String(loginRes) === 'illegalString') {
            //非法字符
            let obj = {
                "result": "loginErr",
                "data": '服务器出错:非法字符!!'
            }
            return ws.send(JSON.stringify(obj))
        } 

        if (loginRes[0].enabled === '0') {
            //帐号停用
            let obj = {
                "result": "loginErr",
                "data": '帐号被停用!!'
            }
            return ws.send(JSON.stringify(obj))
        }
        //登录成功
        let obj = {
            "result": "loginOk",
            "data": userData
        }
        ws.send(JSON.stringify(obj))
    })
}
module.exports.localLogin = (userData, ws) => {
    //和login共用一个方法,省去转加密
    loginModol.userLogin(userData, (err, loginRes) => {
        if (err) { return ws.send('{"error":"服务器出错了!"}') }

        if (loginRes[0].enabled === '0') {
            //帐号停用
            let obj = {
                "result": "loginErr",
                "data": '帐号被停用!!'
            }
            return ws.send(JSON.stringify(obj))
        }
        
        if (loginRes) { ws.send(JSON.stringify({"result": "localLoginOk"})) }
    })
}
//获取服务器列表
module.exports.getServerList = (userData, ws) => {
    loginModol.serverList((err, resSerList) => {
        if (err) {
            ws.send('{"error":"服务器出错了!"}')
        }
        if (resSerList) {
            let obj = {
                'result': 'serverList',
                'data': resSerList
            }
            ws.send(JSON.stringify(obj))
        }
    })
}
//获取角色列表信息
module.exports.getRoleList = (userData, ws) => {
    loginModol.roleList(userData, (err, resRoleLsit) => {
        console.log(userData);
        if (err) {
            ws.send('{"error":"服务器出错了!"}')
        }
        if (resRoleLsit) {
            console.log(resRoleLsit);
            delete resRoleLsit.id;
            let obj = {
                'result': 'roleList',
                'data': resRoleLsit
            }
            ws.send(JSON.stringify(obj))
        }
    })
}
//创建角色
module.exports.createRole = (userData, ws) => {
    //查询已有角色个数
    loginModol.getAllRoleNumb((err, res) => {
        if (err) {
            ws.send('{"error":"服务器出错了!"}')
            return;
        }
        //加入角色ID
        userData.roleid = String(10000000 + res.length);
        loginModol.createRole(userData, (err, createRes) => {
            if (err) {
                ws.send('{"error":"服务器出错了!"}')
            }
            if (createRes) {
                let obj = {
                    'result': 'createOK',
                    'data': {}
                }
                ws.send(JSON.stringify(obj))
            }
        })
    })
}
// module.exports.demo = (userData, ws, io) => {
//     // 推送给所有人
//     io.clients.forEach(client => {
//         if (client.openId === userData) {
//             console.log('关闭了'); 
//             client.close()
//         }
//         console.log(client.openId);   
//     })
// }
