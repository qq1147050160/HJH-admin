const express = require('express')
const WebSocket = require('ws')
const app = express()
const server = require('http').createServer(app)
const io = new WebSocket.Server({server})
const wsRoute = require('./wsRoute.js')
// app.use(express.static(__dirname)) // 开放路径



// WebSocket
let AllSocketUser = []//记录所有用户
io.on('connection', function (ws, req) { console.log('客户端连接')
    //发起客户端ID: req.connection.remoteAddress
    //头信息(存起来搞事情): req.headers['sec-websocket-key']
    ws.openId = req.headers['sec-websocket-key']
    ws.send('{"openId":"'+ ws.openId +'"}')

    // 接受消息
    ws.on('message', function (Info) { 
        console.dir(Info)
        let UserData = JSON.parse(Info)
        wsRoute(UserData.type, UserData.data, ws, io)// 转发到路由
    })
})

io


server.listen(3000, () => { console.log('服务器运行中...') })