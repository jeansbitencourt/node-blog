const path = require('path');

module.exports = function(app){
    /*app.get(/^((?!\/api\/).)*$/, function( req, res, next ) {
        res.sendFile('index.html', { root: path.join(__dirname, '../public') });
    });*/

    app.post('/api/auth', function(req, res, next){
        app.server.controllers.userController.login(app, req,res);
    });
};