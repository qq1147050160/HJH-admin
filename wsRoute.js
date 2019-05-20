const loginController = require('./controllers/login')

module.exports = function (type, data, webSocket, io) {

    //路由配置
    wsRoutes('login', loginController.login)
    wsRoutes('localLogin', loginController.localLogin)
    wsRoutes('getServerList', loginController.getServerList)
    wsRoutes('getRoleList', loginController.getRoleList)
    wsRoutes('createRole', loginController.createRole)
    // wsRoutes('demo', loginController.demo)
    

    // 创造执行者
    function wsRoutes (askType, executor) {
        if (type === askType) {
            executor(data, webSocket, io)
        }
    }
}